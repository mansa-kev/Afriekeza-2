/**
 * Provision portal users via Supabase Admin API + SQL profile setup.
 * Usage: node --env-file=.env.local scripts/provision-users.mjs
 */

import pg from "pg";

const { Client } = pg;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const databaseUrl = process.env.DATABASE_URL;

if (!url || !serviceKey || !databaseUrl) {
  console.error("Missing env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL");
  process.exit(1);
}

const USERS = [
  {
    email: "info.afriekeza.ke@gmail.com",
    password: "Afriekeza@2026",
    fullName: "Afriekeza Admin",
    portalRoles: ["super_admin", "admin"],
    accountStatus: "active",
    kind: "admin",
  },
  {
    email: "mansaakebulan@gmail.com",
    password: "Investor@2026",
    fullName: "Mansa Akebulan",
    portalRoles: ["investor"],
    accountStatus: "active",
    kind: "investor",
    investor: {
      classification: "experienced",
      kycStatus: "approved",
      suitabilityStatus: "approved",
      onboardingStep: 5,
    },
  },
  {
    email: "uniebritcapital2@gmail.com",
    password: "Issuer@2026",
    fullName: "Uniebrit Capital",
    portalRoles: ["business_user"],
    accountStatus: "active",
    kind: "issuer",
    company: {
      legalName: "Uniebrit Capital Ltd",
      tradingName: "Uniebrit Capital",
      sector: "Financial services",
      status: "active",
      kybStatus: "approved",
      fundingReadinessStatus: "ready",
      fundingReadinessScore: 72,
    },
  },
];

async function createAuthUser({ email, password, fullName }) {
  const res = await fetch(`${url}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    }),
  });

  const body = await res.json();
  if (!res.ok) {
    if (body.msg?.includes("already been registered") || body.message?.includes("already")) {
      const listRes = await fetch(
        `${url}/auth/v1/admin/users?email=${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${serviceKey}`,
            apikey: serviceKey,
          },
        },
      );
      const listBody = await listRes.json();
      const existing = listBody.users?.[0];
      if (!existing) throw new Error(`User exists but lookup failed: ${email}`);
      return { id: existing.id, email, created: false };
    }
    throw new Error(`Auth create failed for ${email}: ${JSON.stringify(body)}`);
  }

  return { id: body.id, email, created: true };
}

async function provisionProfile(client, user) {
  const rolesLiteral = `{${user.portalRoles.join(",")}}`;

  await client.query(
    `update public.profiles
     set full_name = $2,
         portal_roles = $3::public.portal_role[],
         account_status = $4::public.account_status
     where id = $1`,
    [user.id, user.fullName, rolesLiteral, user.accountStatus],
  );

  if (user.kind === "investor") {
    const { rows } = await client.query(
      "select id from public.investor_profiles where user_id = $1",
      [user.id],
    );
    if (rows.length === 0) {
      await client.query(
        `insert into public.investor_profiles (
           user_id, classification, kyc_status, suitability_status, onboarding_step, terms_accepted_at
         ) values ($1, $2::public.investor_classification, $3::public.kyc_status, $4::public.suitability_status, $5, now())`,
        [
          user.id,
          user.investor.classification,
          user.investor.kycStatus,
          user.investor.suitabilityStatus,
          user.investor.onboardingStep,
        ],
      );
    } else {
      await client.query(
        `update public.investor_profiles
         set classification = $2::public.investor_classification,
             kyc_status = $3::public.kyc_status,
             suitability_status = $4::public.suitability_status,
             onboarding_step = $5,
             terms_accepted_at = coalesce(terms_accepted_at, now())
         where user_id = $1`,
        [
          user.id,
          user.investor.classification,
          user.investor.kycStatus,
          user.investor.suitabilityStatus,
          user.investor.onboardingStep,
        ],
      );
    }
  }

  if (user.kind === "issuer") {
    const { rows: companyRows } = await client.query(
      `select c.id from public.companies c
       join public.company_users cu on cu.company_id = c.id
       where cu.user_id = $1
       limit 1`,
      [user.id],
    );

    let companyId = companyRows[0]?.id;
    if (!companyId) {
      const insert = await client.query(
        `insert into public.companies (
           legal_name, trading_name, sector, status, kyb_status,
           funding_readiness_status, funding_readiness_score
         ) values ($1, $2, $3, $4::public.company_status, $5::public.kyb_status, $6, $7)
         returning id`,
        [
          user.company.legalName,
          user.company.tradingName,
          user.company.sector,
          user.company.status,
          user.company.kybStatus,
          user.company.fundingReadinessStatus,
          user.company.fundingReadinessScore,
        ],
      );
      companyId = insert.rows[0].id;
      await client.query(
        `insert into public.company_users (company_id, user_id, role, invitation_status)
         values ($1, $2, 'owner', 'accepted')
         on conflict (company_id, user_id) do nothing`,
        [companyId, user.id],
      );
    }
  }
}

async function main() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  for (const spec of USERS) {
    console.log(`\n→ ${spec.email} (${spec.kind})`);
    const auth = await createAuthUser(spec);
    console.log(`  auth ${auth.created ? "created" : "exists"}: ${auth.id}`);

    await new Promise((r) => setTimeout(r, 500));

    const { rows } = await client.query(
      "select id from public.profiles where id = $1",
      [auth.id],
    );
    if (rows.length === 0) {
      await client.query(
        `insert into public.profiles (id, email, full_name, portal_roles, account_status)
         values ($1, $2, $3, $4::public.portal_role[], $5::public.account_status)
         on conflict (id) do nothing`,
        [
          auth.id,
          spec.email,
          spec.fullName,
          `{${spec.portalRoles.join(",")}}`,
          spec.accountStatus,
        ],
      );
    }

    await provisionProfile(client, { ...spec, id: auth.id });
    console.log(`  profile + ${spec.kind} domain ready`);
  }

  await client.end();
  console.log("\nAll users provisioned.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
