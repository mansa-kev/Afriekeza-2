# Afriekeza Supabase Migrations

## Quick setup (local)

1. Copy `.env.example` → `.env.local` and fill Supabase credentials.
2. If direct `db.*.supabase.co` fails (IPv6-only), use the **connection pooler** URL in `DATABASE_URL` (find region in Supabase → Project Settings → Database → Connection string → Transaction pooler).
3. Run migrations: `npm run db:migrate`
4. Create the documents bucket: `npm run storage:setup`

Or run scripts **in order** in the Supabase SQL Editor.

| # | File | Purpose |
|---|------|---------|
| 1 | `001_core_auth_profiles.sql` | Profiles, roles, platform settings, auth trigger |
| 2 | `002_investor_domain.sql` | Investor profiles, KYC, suitability |
| 3 | `003_business_domain.sql` | Companies, KYB, raise applications |
| 4 | `004_documents_opportunities.sql` | Documents, opportunities |
| 5 | `005_commitments_wallet_portfolio.sql` | Wallet, commitments, portfolio |
| 6 | `006_registry_reporting.sql` | Cap table, ESOP, issuer reports |
| 7 | `007_support_audit.sql` | Support tickets, notifications, audit log |
| 9 | `009_p1_rls_policies.sql` | P1 write RLS + storage policies |
| 10 | `010_p1_commitments_support.sql` | Commitments, portfolio, wallet, support writes |
| 11 | `011_p2_operational.sql` | P2 wallet ops, registry/reporting RLS, notifications RPC |

## P1 pilot flows (app)

- **Investor:** onboarding → admin KYC approve → commit on open opportunity → portfolio
- **Admin:** allocations queue → allocate commitment → creates portfolio position
- **Support:** tickets from investor/business portals → admin resolve/close
- **Signup:** `/investor/login` includes create-account form

## P2 operational flows (app)

- **Wallet:** M-Pesa reference deposit → admin approve in `/admin/payments` → balance credited
- **Commitment pay:** wallet debit or M-Pesa ref → admin verify → allocate (repayment schedule auto-created)
- **Notifications:** bell in portal header on key events
- **Business:** use-of-funds tracking, cap table + ESOP + CSV export, issuer report submit
- **Admin:** document review, report publish, FX rate in settings, repayment marking

## Auth (Supabase dashboard)

Under **Authentication → URL configuration**, add:

- **Site URL:** `http://localhost:3000` (and production domain when deployed)
- **Redirect URLs:** `http://localhost:3000/auth/callback`, `https://your-domain.com/auth/callback`

Enable email/password sign-in under **Authentication → Providers**.

## Rules

- **No mock seed data** — tables start empty
- Reference data only in `platform_settings` (FX rate, instrument list)
- Assign admin role manually after first user signs up:

```sql
update public.profiles
set portal_roles = array['super_admin']::public.portal_role[]
where email = 'your@email.com';
```

## Storage

Private bucket `documents` (50 MB, PDF/images/spreadsheets). RLS policies are in migration `004_documents_opportunities.sql`.
