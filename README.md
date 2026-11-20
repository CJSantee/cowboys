# 🤠 Cowboy Counter

A competitive photo-sharing web application where five cowboys compete in a year-long hat-wearing challenge. Built with React, TypeScript, and modern web technologies.

## 📖 About The Competition

The Cowboy Competition is a year-long friendly rivalry (January 12, 2025 - January 12, 2026) where five cowboys earn points by taking photos of themselves wearing cowboy hats in public places. The cowboy with the fewest points at the end becomes "The Loser" and faces a humorous punishment chosen by the other four cowboys.

### 🏆 Rules Summary

- **Duration**: One full year (Jan 12, 2025 6:06 PM CT - Jan 12, 2026 6:06 PM CT)
- **Scoring**: 1 point per valid photo, 3 points if mounted on a horse
- **Submission Limit**: One photo per cowboy per calendar day
- **Location Requirement**: Photos must be taken in public places (workplace doesn't count)
- **Punishment**: Loser wears an outfit chosen by the other cowboys to a group outing
- **Integrity**: "Shame" clause allows 4 cowboys to deduct 3 points from the 5th for unsportsmanlike conduct

## ✨ Features

### 📸 Photo Management
- **Photo Gallery**: Swipeable photo viewer with touch/gesture support
- **Photo Submission**: Upload photos with date selection and cowboy tagging
- **Image Processing**: Automatic image optimization and storage

### 📊 Competition Tracking
- **Real-time Leaderboard**: Interactive bar chart showing current standings
- **Individual Profiles**: Public cowboy profiles with stats and photo galleries
- **Progress Tracking**: Visual progress indicators and submission history

### 🔐 Authentication & Security
- **User Authentication**: Secure login system with session management
- **Protected Routes**: Authenticated access for submission and account features
- **Role-based Access**: Different permissions for participants vs. viewers

### 📱 User Experience
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Dark Mode Support**: Automatic theme switching
- **Progressive Web App**: Installable on mobile devices
- **Touch Gestures**: Swipe navigation for photo galleries

### ⚖️ Charter System
- **Digital Charter**: Full competition rules and regulations
- **Cowboy Assent**: Digital signature system for rule acknowledgment
- **Rule Enforcement**: Built-in systems for managing competition integrity

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Flowbite React** - React components built on Tailwind

### State Management & Data
- **TanStack Query** - Server state management and caching
- **React Router** - Client-side routing
- **Cloudflare Workers + D1** - Read-only API and cowboy sign-in (`worker/`)

### UI/UX Libraries
- **React Swipeable** - Touch gesture support
- **ApexCharts** - Interactive charts and data visualization
- **Date-fns** - Modern date utility library
- **Sonner** - Toast notifications
- **Headless UI** - Accessible UI primitives

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CJSantee/cowboys.git
cd cowboys
```

2. Install dependencies (`react-simple-maps` still declares a React 18 peer dependency):
```bash
npm install --legacy-peer-deps
```

3. Create `.dev.vars` from `.dev.vars.example` and set `SESSION_SECRET` (`openssl rand -base64 32`).

4. Create the local D1 database and load the data (see [Data](#-data)):
```bash
npm run db:migrate:local
npx wrangler d1 execute cowboy-counter --local --file=<seed.sql>
```

5. Start the development server, which runs the React app and the API Worker together:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start the Vite dev server with the Worker running in workerd
- `npm run build` - Type-check and build the client and the Worker
- `npm run preview` - Build, then serve the production build locally
- `npm run deploy` - Build and deploy to Cloudflare
- `npm run test` - Run the Worker tests (Vitest, in workerd, against a fixture D1)
- `npm run lint` - Run ESLint
- `npm run cf-typegen` - Regenerate `worker-configuration.d.ts` after changing `wrangler.jsonc`
- `npm run db:migrate:local` / `npm run db:migrate:remote` - Apply D1 migrations
- `npm run parity -- <dir>` - Diff the Worker's responses against the original API's (see [Data](#-data))

## 📁 Project Structure

```
worker/                # Read-only API (Hono) served at /api by the same Worker as the site
├── index.ts           # Routes
├── cowboys.ts         # Response builders (ports of the original Postgres queries)
├── dataset.ts         # Loads and indexes the D1 data
└── auth.ts            # Cowboy sign-in and session cookies
migrations/            # D1 schema
scripts/parity.ts      # Compares Worker responses with the original API
test/                  # Worker tests and fixture data
src/
├── components/          # Reusable UI components
│   ├── Charts/         # Chart components (BarChart, etc.)
│   ├── AuthComponent.tsx
│   ├── Header.tsx
│   ├── Leaderboard.tsx
│   └── ...
├── pages/              # Route components
│   ├── home/          # Home page sections
│   │   ├── Photos.tsx
│   │   ├── Rules.tsx
│   │   └── Leaderboard.tsx
│   ├── cowboys/       # Cowboy profile pages
│   ├── Home.tsx
│   └── Login.tsx
├── hooks/             # Custom React hooks
│   └── queries/       # Data fetching hooks
├── assets/           # Static assets
└── types/            # TypeScript type definitions
```

## 🗄️ Data

The competition is over, so the site is a read-only archive. The data lives in a Cloudflare D1 database that is loaded once from the original Pool Scores Postgres database.

1. In the `pool-scores` repo (`apps/api`), export the seed and the original API's responses:
   ```bash
   npm run db:export-cowboys -- <seed.sql> --golden <dir>
   ```
2. Load the seed into D1 (`--local` for development, `--remote` for production):
   ```bash
   npm run db:migrate:remote
   npx wrangler d1 execute cowboy-counter --remote --file=<seed.sql>
   ```
3. Check that the Worker returns the same data as the original API, for both logged-out and cowboy views (runs against the local D1):
   ```bash
   npm run parity -- <dir>
   ```

**Never commit the seed or the golden responses.** This repo is public: both contain the URLs of private photos, and the seed also contains password hashes. `.gitignore` excludes `*seed*.sql` and `parity/`. Delete both once they're loaded.

## 🔐 Sign-in

Visitors see the public view: private photos are blurred and private cowboys' pages return 404. Cowboys sign in with their existing Pool Scores username and password to see everything.

- The seed copies each cowboy's username and bcrypt hash into `cowboy_logins`. Usernames match case-insensitively, as in Pool Scores.
- `POST /api/auth/login` checks the password once (about 55 ms of CPU with bcryptjs, so it needs the Workers Paid plan). It then sets an HttpOnly `cc_session` cookie holding an HS256 token that expires after 180 days.
- `GET /api/auth/session` returns the signed-in cowboy, and `POST /api/auth/logout` clears the cookie.
- Sign-in attempts are rate limited to 10 a minute per IP and per username (the `LOGIN_RATE_LIMITER` binding).
- To sign everyone out, rotate `SESSION_SECRET`. Password changes made in Pool Scores don't carry over unless you export the seed again.

## 🌐 Deployment

The site and the API are a single Cloudflare Worker. Workers Static Assets serves the Vite build, and requests to `/api/*` run the Worker (see `wrangler.jsonc`).

```bash
npm run deploy
```

The first deploy creates the `cowboy-counter` D1 database. After that:

1. Set the session secret: `npx wrangler secret put SESSION_SECRET` (any long random string, such as `openssl rand -base64 32`).
2. Run step 2 of [Data](#-data) with `--remote`. To serve `cowboycounter.com`, add the custom domain routes noted in `wrangler.jsonc`, then retire the Vercel project and `vercel.json`.

## 🤝 Contributing

This is a private competition app for five specific cowboys, but the codebase demonstrates modern React development patterns and could serve as a reference for similar competitive applications.

## 📄 License

Private repository - All rights reserved.

## 🎯 Competition Status

**Current Phase**: Complete (read-only archive)  
**End Date**: January 12, 2026 at 6:06 PM CT  
**Participants**: 5 Cowboys  
**Current Leader**: Check the leaderboard at [cowboycounter.com](https://cowboycounter.com)

---

*May the best cowboy win! 🤠*
