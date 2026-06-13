# Afriekeza

Private-markets platform for African businesses and verified investors — marketing site plus Investor, Issuer, and Admin portals.

## Local development

```bash
npm install
cp .env.example .env.local   # fill in Supabase + optional payment keys
npm run db:migrate           # requires DATABASE_URL in .env.local
npm run dev
```

Portal URLs (local):

- Marketing: `http://localhost:3000`
- Investor: `http://localhost:3000/investor/dashboard?portal=investor`
- Issuer: `http://localhost:3000/business/dashboard?portal=business`
- Admin: `http://localhost:3000/admin/dashboard?portal=admin`

## Deploy on Vercel (recommended, free tier)

Vercel Hobby is free for personal/small projects and is the best fit for this Next.js app (SSR, API routes, middleware). **Keep your domain on Namecheap** — you only point DNS to Vercel; no extra hosting fee.

### 1. Push to GitHub

Ensure `main` is pushed to your GitHub repository.

### 2. Import in Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `npm run build` (default).
4. Install command: `npm install` (default).

### 3. Environment variables (Vercel → Settings → Environment Variables)

Copy from `.env.example`. Minimum for a working pilot:

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only; never expose to client |
| `DATABASE_URL` | Supabase pooler URL (for migrations run locally or via CI) |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` (production URL) |
| `PAYMENTS_SANDBOX` | `true` until live M-Pesa/Stripe keys are ready |

Add payment provider keys when going live (`MPESA_*`, `STRIPE_*`, etc.).

### 4. Namecheap domain → Vercel (no Namecheap hosting needed)

In **Namecheap → Domain → Advanced DNS**:

| Type | Host | Value |
|------|------|--------|
| `A` | `@` | `76.76.21.21` (Vercel apex) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

In **Vercel → Project → Settings → Domains**, add:

- `yourdomain.com`
- `www.yourdomain.com`

Optional portal subdomains (match `lib/portal/resolve.ts`):

| Subdomain | Portal |
|-----------|--------|
| `invest.yourdomain.com` | Investor |
| `business.yourdomain.com` | Issuer |
| `admin.yourdomain.com` | Admin |

Add each as a domain in Vercel; Namecheap CNAME records point to `cname.vercel-dns.com`.

### 5. Supabase auth redirects

In **Supabase → Authentication → URL configuration**:

- **Site URL:** `https://yourdomain.com`
- **Redirect URLs:**  
  `https://yourdomain.com/auth/callback`  
  `https://invest.yourdomain.com/auth/callback` (if using subdomains)

### 6. Redeploy

After env vars and domains are set, trigger a redeploy. Set `NEXT_PUBLIC_APP_URL` to your canonical production URL.

---

## Can I host on Namecheap without paying?

**Namecheap shared hosting** (Stellar, etc.) is PHP/static-focused and does **not** run Next.js 16 with server components, middleware, and API routes reliably. You would still pay for hosting and likely need a VPS.

**Zero extra hosting cost:** use **Vercel free tier + Namecheap domain only** (domain renewal is your only Namecheap charge you already have). The app runs on Vercel; Namecheap only provides DNS.

Alternatives with free tiers: Cloudflare Pages, Netlify (similar DNS setup from Namecheap).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Apply Supabase SQL migrations |
| `npm run users:provision` | Seed test users (dev only) |
| `npm run storage:setup` | Create Supabase storage buckets |
