import { createClient } from "@/lib/supabase/server";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export async function getCurrentProfile() {
  if (!isSupabaseConfigured()) {
    return { user: null, profile: null };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { user: null, profile: null };

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    return { user, profile };
  } catch {
    return { user: null, profile: null };
  }
}

async function safeQuery<T>(query: () => Promise<{ data: T | null; error: unknown }>) {
  if (!isSupabaseConfigured()) {
    return { data: [] as T, error: null };
  }
  try {
    const result = await query();
    return { data: (result.data ?? []) as T, error: result.error };
  } catch (error) {
    return { data: [] as T, error };
  }
}

export async function listOpportunities(publishedOnly = false) {
  return safeQuery(async () => {
    const supabase = await createClient();
    let query = supabase
      .from("opportunities")
      .select(
        "id, slug, title, instrument, status, target_raise_kes, minimum_investment_kes, tenor_months, target_return_pct, repayment_frequency, risk_label, sector, location, company_id",
      )
      .order("created_at", { ascending: false });

    if (publishedOnly) {
      query = query.in("status", ["coming_soon", "open", "closing_soon", "fully_subscribed", "closed", "reporting", "repaid"]);
    }

    return query;
  });
}

export async function listInvestorsForAdmin() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("investor_profiles")
      .select(
        "id, user_id, classification, kyc_status, suitability_status, created_at, profiles(full_name, email)",
      )
      .order("created_at", { ascending: false });
  });
}

export async function listBusinessesForAdmin() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("companies")
      .select(
        "id, legal_name, trading_name, sector, status, kyb_status, funding_readiness_status, created_at",
      )
      .order("created_at", { ascending: false });
  });
}

export async function listAuditEvents(limit = 50) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("audit_events")
      .select(
        "id, actor_id, entity_type, entity_id, action, previous_state, new_state, note, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit);
  });
}

export async function getInvestorProfile(userId: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("investor_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function listCompaniesForAdmin() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("companies")
      .select("id, legal_name, trading_name, sector, status")
      .order("legal_name");
  });
}

export async function getRaiseApplicationForUser(userId: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data: membership } = await supabase
      .from("company_users")
      .select("company_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!membership?.company_id) return null;
    const { data } = await supabase
      .from("raise_applications")
      .select("*")
      .eq("company_id", membership.company_id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function listDocumentsForOwner(ownerType: string, ownerId: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("documents")
      .select("id, category, file_name, status, created_at, storage_path")
      .eq("owner_type", ownerType)
      .eq("owner_id", ownerId)
      .order("created_at", { ascending: false });
  });
}

export async function getCompanyForUser(userId: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("company_users")
      .select("company_id, role, companies(*)")
      .eq("user_id", userId)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getInvestorDashboardSummary(userId: string) {
  if (!isSupabaseConfigured()) {
    return {
      walletBalanceKes: 0,
      committedKes: 0,
      activePositions: 0,
      pendingCommitments: 0,
    };
  }

  try {
    const supabase = await createClient();
    const { data: investor } = await supabase
      .from("investor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: wallet } = await supabase
      .from("wallet_accounts")
      .select("available_balance_kes")
      .eq("user_id", userId)
      .maybeSingle();

    if (!investor) {
      return {
        walletBalanceKes: Number(wallet?.available_balance_kes ?? 0),
        committedKes: 0,
        activePositions: 0,
        pendingCommitments: 0,
      };
    }

    const { data: positions } = await supabase
      .from("portfolio_positions")
      .select("principal_kes")
      .eq("investor_id", investor.id)
      .eq("status", "active");

    const { data: pending } = await supabase
      .from("commitments")
      .select("id, amount_kes")
      .eq("investor_id", investor.id)
      .in("status", ["pending_acknowledgement", "pending_payment", "paid"]);

    const committedKes = (positions ?? []).reduce(
      (sum, p) => sum + Number(p.principal_kes),
      0,
    );

    return {
      walletBalanceKes: Number(wallet?.available_balance_kes ?? 0),
      committedKes,
      activePositions: positions?.length ?? 0,
      pendingCommitments: pending?.length ?? 0,
    };
  } catch {
    return {
      walletBalanceKes: 0,
      committedKes: 0,
      activePositions: 0,
      pendingCommitments: 0,
    };
  }
}

export async function listPortfolioForUser(userId: string) {
  if (!isSupabaseConfigured()) return { data: [], error: null };

  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!investor) return { data: [], error: null };

  return safeQuery(async () =>
    supabase
      .from("portfolio_positions")
      .select(
        "id, principal_kes, status, allocated_at, opportunities(id, slug, title, instrument, target_return_pct, tenor_months)",
      )
      .eq("investor_id", investor.id)
      .order("allocated_at", { ascending: false }),
  );
}

export async function listCommitmentsForUser(userId: string) {
  if (!isSupabaseConfigured()) return { data: [], error: null };

  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!investor) return { data: [], error: null };

  return safeQuery(async () =>
    supabase
      .from("commitments")
      .select("id, amount_kes, status, created_at, opportunities(id, slug, title)")
      .eq("investor_id", investor.id)
      .order("created_at", { ascending: false }),
  );
}

export async function listPendingAllocations() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("commitments")
      .select(
        "id, amount_kes, status, created_at, acknowledgement_complete, investor_profiles(id, profiles(full_name, email)), opportunities(id, title, slug)",
      )
      .in("status", ["pending_payment", "paid"])
      .order("created_at", { ascending: false });
  });
}

export async function listSupportTickets(portal?: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    let query = supabase
      .from("support_tickets")
      .select(
        "id, portal, category, subject, body, status, created_at, user_id, profiles(full_name, email)",
      )
      .order("created_at", { ascending: false });

    if (portal) {
      query = query.eq("portal", portal);
    }

    return query;
  });
}

export async function getCommitmentForOpportunity(userId: string, opportunityId: string) {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const { data: investor } = await supabase
      .from("investor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!investor) return null;

    const { data } = await supabase
      .from("commitments")
      .select("id, status, amount_kes")
      .eq("investor_id", investor.id)
      .eq("opportunity_id", opportunityId)
      .in("status", ["draft", "pending_acknowledgement", "pending_payment", "paid", "allocated"])
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function listSupportTicketsForUser(userId: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("support_tickets")
      .select("id, portal, category, subject, body, status, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
  });
}

export async function listNotificationsForUser(userId: string, limit = 20) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("notifications")
      .select("id, title, body, link, read_at, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
  });
}

export async function listWalletTransactions(userId: string) {
  if (!isSupabaseConfigured()) return { data: [], error: null };
  const supabase = await createClient();
  const { data: wallet } = await supabase
    .from("wallet_accounts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!wallet) return { data: [], error: null };

  return safeQuery(async () =>
    supabase
      .from("wallet_transactions")
      .select("id, type, amount_kes, reference, status, metadata, created_at")
      .eq("wallet_id", wallet.id)
      .order("created_at", { ascending: false }),
  );
}

export async function listPendingDeposits() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("wallet_transactions")
      .select(
        "id, amount_kes, reference, status, created_at, metadata, wallet_accounts(profiles(full_name, email))",
      )
      .eq("type", "deposit")
      .eq("status", "pending")
      .order("created_at", { ascending: false });
  });
}

export async function listPendingCommitmentPayments() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("commitments")
      .select(
        "id, amount_kes, payment_reference, status, created_at, investor_profiles(profiles(full_name, email)), opportunities(title)",
      )
      .eq("status", "pending_payment")
      .not("payment_reference", "is", null)
      .order("created_at", { ascending: false });
  });
}

export async function listRepaymentsForUser(userId: string) {
  if (!isSupabaseConfigured()) return { data: [], error: null };

  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!investor) return { data: [], error: null };

  const { data: positions } = await supabase
    .from("portfolio_positions")
    .select("id")
    .eq("investor_id", investor.id);

  const positionIds = (positions ?? []).map((p) => p.id);
  if (positionIds.length === 0) return { data: [], error: null };

  return safeQuery(async () =>
    supabase
      .from("repayments")
      .select(
        "id, amount_kes, due_date, paid_at, status, portfolio_positions(opportunity_id, opportunities(title))",
      )
      .in("position_id", positionIds)
      .order("due_date", { ascending: true }),
  );
}

export async function listPublishedReportsForUser(userId: string) {
  if (!isSupabaseConfigured()) return { data: [], error: null };
  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!investor) return { data: [], error: null };

  const { data: positions } = await supabase
    .from("portfolio_positions")
    .select("opportunity_id")
    .eq("investor_id", investor.id);

  const oppIds = (positions ?? []).map((p) => p.opportunity_id).filter(Boolean);
  if (oppIds.length === 0) return { data: [], error: null };

  return safeQuery(async () =>
    supabase
      .from("issuer_reports")
      .select("id, period_label, content, published_at, opportunity_id, companies(legal_name)")
      .in("opportunity_id", oppIds)
      .not("published_at", "is", null)
      .order("published_at", { ascending: false }),
  );
}

export async function listIssuerReportsForCompany(companyId: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("issuer_reports")
      .select("id, period_label, status, content, submitted_at, published_at, created_at")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });
  });
}

export async function listIssuerReportsForAdmin() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("issuer_reports")
      .select(
        "id, period_label, status, content, submitted_at, published_at, companies(legal_name)",
      )
      .in("status", ["submitted", "published"])
      .order("submitted_at", { ascending: false });
  });
}

export async function listDocumentsForReview() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("documents")
      .select(
        "id, owner_type, category, file_name, status, created_at, profiles!documents_uploaded_by_fkey(full_name, email)",
      )
      .in("status", ["uploaded", "under_review"])
      .order("created_at", { ascending: false });
  });
}

export async function listUseOfFundsForCompany(companyId: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("use_of_funds_items")
      .select("id, category, budget_kes, actual_kes, variance_note, created_at")
      .eq("company_id", companyId)
      .order("category");
  });
}

export async function listCapTableForCompany(companyId: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("cap_table_entries")
      .select("id, holder_name, share_class, units, ownership_pct")
      .eq("company_id", companyId)
      .order("holder_name");
  });
}

export async function listEsopPoolsForCompany(companyId: string) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("esop_pools")
      .select("id, pool_name, allocated_units, reserved_units")
      .eq("company_id", companyId)
      .order("pool_name");
  });
}

export async function listRepaymentsForAdmin() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("repayments")
      .select(
        "id, amount_kes, due_date, status, portfolio_positions(opportunities(title), investor_profiles(profiles(full_name, email)))",
      )
      .eq("status", "scheduled")
      .order("due_date", { ascending: true });
  });
}

export async function countOpenSupportTickets() {
  if (!isSupabaseConfigured()) return 0;
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("support_tickets")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress", "waiting_on_user"]);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function listPaymentIntents(limit = 50) {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("payment_intents")
      .select(
        "id, purpose, provider, amount_kes, currency, status, external_id, failure_reason, created_at, completed_at, user_id, profiles(full_name, email)",
      )
      .order("created_at", { ascending: false })
      .limit(limit);
  });
}

export async function listTaxStatementsForUser(userId: string) {
  if (!isSupabaseConfigured()) return { data: [], error: null };
  const supabase = await createClient();
  const { data: investor } = await supabase
    .from("investor_profiles")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!investor) return { data: [], error: null };

  return safeQuery(async () =>
    supabase
      .from("tax_statements")
      .select("id, tax_year, currency, total_income_kes, total_withholding_kes, summary, status, published_at")
      .eq("investor_id", investor.id)
      .not("published_at", "is", null)
      .order("tax_year", { ascending: false }),
  );
}

export async function listSecondaryListings() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("secondary_market_listings")
      .select(
        "id, asking_amount_kes, status, window_opens_at, window_closes_at, notes, portfolio_positions(opportunities(title, slug))",
      )
      .eq("status", "open")
      .order("created_at", { ascending: false });
  });
}

export async function listInvestmentGroups() {
  return safeQuery(async () => {
    const supabase = await createClient();
    return supabase
      .from("investment_groups")
      .select("id, name, target_amount_kes, status, opportunities(title, slug)")
      .in("status", ["forming", "open"])
      .order("created_at", { ascending: false });
  });
}
