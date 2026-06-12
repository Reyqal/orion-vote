# ⭐ OrionVote — Favorite Website Voting System

A stunning, full-stack voting platform where users preview deployed websites via embedded iframes and vote for their favorites. Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **NextAuth.js** (Google OAuth), and **Prisma ORM** (PostgreSQL).

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat-square&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![NextAuth.js](https://img.shields.io/badge/NextAuth-v4-purple?style=flat-square)

---

## ✨ Features

- 🔐 **Google OAuth** — Secure "Login with Google" via NextAuth.js
- 🗳️ **1 Account = 1 Vote** — Enforced at the database level with a unique constraint
- 🖼️ **Live Iframe Previews** — Preview deployed websites directly on the platform
- ⚡ **Optimistic UI** — Instant visual feedback when voting
- 🛡️ **Admin Dashboard** — Add/delete participant websites (email-based admin access)
- 🌙 **Dark Glassmorphism UI** — Premium design with smooth animations
- 🚀 **Vercel-Ready** — Optimized for seamless Vercel deployment

---

## 🛠️ Tech Stack

| Layer       | Technology                       |
|-------------|----------------------------------|
| Framework   | Next.js 16 (App Router)          |
| Styling     | Tailwind CSS v4                  |
| Auth        | NextAuth.js v4 (Google Provider) |
| ORM         | Prisma (PostgreSQL)              |
| Deployment  | Vercel                           |

---

## 📋 Prerequisites

- **Node.js** 18+ and **npm**
- **PostgreSQL** database (local or hosted: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres))
- **Google Cloud Console** project with OAuth 2.0 credentials

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd vote-app
npm install
```

### 2. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

#### Required variables:

| Variable             | Description                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| `DATABASE_URL`       | PostgreSQL connection string                                                |
| `NEXTAUTH_SECRET`    | Random secret for NextAuth (generate: `openssl rand -base64 32`)            |
| `NEXTAUTH_URL`       | Your app URL (`http://localhost:3000` for local dev)                         |
| `GOOGLE_CLIENT_ID`   | Google OAuth Client ID                                                      |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret                                                |
| `ADMIN_EMAILS`       | Comma-separated list of admin Google emails (e.g., `admin@gmail.com`)       |

### 3. Set up Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Set the application type to **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local dev)
   - `https://your-domain.vercel.app/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** into your `.env` file

### 4. Set up the database

Push the Prisma schema to your database:

```bash
npx prisma db push
```

(Optional) Open Prisma Studio to view your data:

```bash
npx prisma studio
```

### 5. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Admin Access

Admin access is controlled by the `ADMIN_EMAILS` environment variable. Any Google account whose email appears in this comma-separated list gets admin privileges.

**Example:**
```env
ADMIN_EMAILS="alice@gmail.com,bob@gmail.com"
```

Admins can:
- Access the `/admin` dashboard
- Add new participant websites (title, description, URL)
- Delete websites (and their votes)

---

## 🗄️ Database Schema

```
User ──< Vote >── Website
  │                   │
  └── Account         └── id, title, description,
  └── Session             url, embedUrl, createdAt
```

- **User**: Synced from Google OAuth via NextAuth
- **Website**: Participant sites added by admins
- **Vote**: Junction table with `@@unique([userId, websiteId])` — ensures 1 vote per user per website

---

## 🚢 Deploy to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables from `.env.example`
4. Set `NEXTAUTH_URL` to your Vercel domain (e.g., `https://OrionVote.vercel.app`)
5. Deploy!

### 3. Post-deployment

- Update your Google OAuth redirect URI to include `https://your-domain.vercel.app/api/auth/callback/google`
- The database schema will be synced automatically if using Vercel Postgres, or run `npx prisma db push` manually

---

## 📁 Project Structure

```
vote-app/
├── prisma/
│   └── schema.prisma          # Database models
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   │   ├── vote/route.ts               # Vote toggle API
│   │   │   └── websites/
│   │   │       ├── route.ts                # List & create websites
│   │   │       └── [id]/route.ts           # Delete website
│   │   ├── admin/page.tsx     # Admin dashboard
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Tailwind & custom styles
│   ├── components/
│   │   ├── AdminPanel.tsx     # Admin form & management
│   │   ├── Navbar.tsx         # Top navigation
│   │   ├── Providers.tsx      # NextAuth SessionProvider
│   │   ├── VoteButton.tsx     # Vote toggle with optimistic UI
│   │   └── WebsiteCard.tsx    # Website card with iframe
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration
│   │   └── prisma.ts          # Prisma client singleton
│   └── types/
│       └── next-auth.d.ts     # NextAuth type augmentation
├── .env.example
├── next.config.ts
├── package.json
└── README.md
```

---

## ⚠️ Notes on Iframe Embedding

Some websites may block iframe embedding via `X-Frame-Options` or Content Security Policy headers. When this happens, the card will display a "Preview unavailable" fallback with a link to open the website in a new tab.

Websites deployed on **Vercel**, **Netlify**, and similar platforms generally allow iframe embedding by default.

---

## 📄 License

MIT
