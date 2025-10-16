# ESE Evaluation & Recognition System

Production-ready web application for Eternity School of Egypt (ESE) implementing Employee of the Month (EOM) and Multi-Rater Evaluation (MRE) programs.

## Features

### Employee of the Month (EOM)
- **Categories**: Outstanding Leadership, Team Spirit, Innovation, Rising Star, Service Excellence
- **Monthly Windows**: 
  - Nominations: 15th of each month
  - Voting: 18th-20th of each month
  - Winner announcements: First working day of next month
- **Rules**: 
  - One win per employee per academic term
  - No self-nomination or self-voting
  - CEO approval gate
  - P&C verification

### Multi-Rater Evaluation (MRE)
- **Cycles**: Two rounds per year
  - Round 1: December 15-25
  - Round 2: March 15-25
- **360-Degree Reviews**: Configurable rater contexts with weight matrices
- **Target Groups**: Admin and Academic staff
- **Domains**: Professionalism, Communication, Collaboration, Innovation, Results

### Access Control (RBAC)
- **CEO**: Full admin access
- **P&C**: Admin and verification
- **Leadership**: Nominate, vote, evaluate
- **Staff**: View own results and recognition

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth (Email magic links + optional Google OAuth)
- **i18n**: next-intl (EN/AR with RTL support)
- **Scheduling**: node-cron (Africa/Cairo timezone)
- **Testing**: Vitest + React Testing Library + Playwright

## Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm 10+

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Database (Required)
DATABASE_URL="postgresql://user:password@localhost:5432/ese_eval?schema=public"

# NextAuth (Required)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-min-32-chars-long"

# Email Provider (Optional - for magic links)
EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
EMAIL_FROM="noreply@ese-school.edu.eg"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Admin Setup (Required for seeding)
ADMIN_EMAIL="admin@ese-school.edu.eg"

# Timezone
TZ="Africa/Cairo"
```

### One-Command Local Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` and sign in with the admin email.

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations (dev)
npm run prisma:deploy    # Deploy migrations (prod)
npm run prisma:studio    # Open Prisma Studio
npm run seed             # Seed database

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:e2e         # Run e2e tests

# Code Quality
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript checks
npm run format           # Format with Prettier

# Cron Jobs
npm run cron             # Run scheduled jobs (for testing)
```

## Project Structure

```
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeding
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── auth/           # Authentication pages
│   │   ├── eom/            # EOM pages
│   │   ├── mre/            # MRE pages
│   │   ├── admin/          # Admin panel
│   │   └── help/           # Help page
│   ├── components/
│   │   └── ui/             # shadcn/ui components
│   └── lib/
│       ├── auth/           # Authentication logic
│       ├── db.ts           # Prisma client
│       └── utils.ts        # Utility functions
├── e2e/                    # Playwright tests
└── types/                  # TypeScript type definitions
```

## Authentication

The app supports multiple authentication methods:

1. **Email Magic Links** (if `EMAIL_SERVER` is configured)
   - Passwordless authentication
   - Secure token-based login

2. **Google OAuth** (if Google credentials are configured)
   - Single sign-on with Google accounts

3. **Development Fallback**
   - If no auth provider is configured, a dev magic link will be printed to server logs
   - Use this only in development

## Branding

The application uses ESE's brand identity:

### Colors
- **Blues** (Language Division): `#094773`, `#23547B`, `#485D7B`, `#2D7EA1`, `#67A1BA`, `#9DC6E1`, `#869FC9`
- **Greens** (International): `#2C5B4C`, `#5D7D60`, `#487557`, `#7CA48A`, `#8EB49B`, `#E5F6DF`, `#86C997`, `#D1DCCD`

### Fonts
- **Body**: Quicksand (Google Fonts)
- **Headings**: Playfair Display (stand-in for "The Seasons")

## Deployment

### Railway Deployment

1. **Create Railway Project**
   ```bash
   railway init
   ```

2. **Add PostgreSQL Plugin**
   - In Railway dashboard, add PostgreSQL plugin
   - Database URL will be automatically set

3. **Set Environment Variables**
   - Add all required variables from `.env.example`
   - Set `NEXTAUTH_URL` to your production URL

4. **Deploy**
   ```bash
   railway up
   ```

5. **Run Migrations & Seed**
   ```bash
   railway run npm run prisma:deploy
   railway run npm run seed
   ```

### CI/CD

GitHub Actions CI runs on every push to `main`:
- Install dependencies
- Generate Prisma client
- Run linters and type checks
- Run unit tests
- Build the application
- Deploy migrations

## Cron Jobs

Scheduled tasks run automatically (Africa/Cairo timezone):

- **EOM Cycle Management**: Open/close nomination and voting windows
- **MRE Cycle Management**: Open/close evaluation cycles
- **Winner Computation**: Calculate and announce winners
- **Reminder Emails**: Notify incomplete tasks

Test cron jobs locally:
```bash
npm run cron
```

## Definition of Done

A feature is complete when:

- ✅ Code is written and follows ESLint/Prettier standards
- ✅ TypeScript compiles without errors
- ✅ Unit tests pass
- ✅ E2E tests pass (if applicable)
- ✅ Code is reviewed
- ✅ Database migrations run successfully
- ✅ Feature works in development and staging
- ✅ Documentation is updated
- ✅ Accessibility standards met (WCAG AA)
- ✅ Works on mobile and desktop
- ✅ CI pipeline passes

## Acceptance Tests

### EOM Tests
- ✅ Leadership can nominate during nomination window
- ✅ Nominations blocked outside window
- ✅ No self-nomination allowed
- ✅ Voting respects one vote per category limit
- ✅ No self-voting allowed
- ✅ Rotation rule blocks duplicate wins in same term
- ✅ Certificate PDF generation works

### MRE Tests
- ✅ Assignments auto-generated on cycle open
- ✅ Raters can submit domain scores
- ✅ Composite scores calculated correctly with weights
- ✅ Required evaluations enforced

### RBAC Tests
- ✅ CEO sees admin panel
- ✅ P&C sees verification tools
- ✅ Leadership sees nomination/voting/evaluation pages
- ✅ Staff sees own results only

### i18n Tests
- ✅ Arabic language switch works
- ✅ RTL layout applied for Arabic
- ✅ Key labels translated

### Accessibility Tests
- ✅ Keyboard navigation works
- ✅ Screen reader compatible
- ✅ WCAG AA contrast ratios met
- ✅ Focus indicators visible

## Support

For issues or questions:
- Technical: Contact IT Support
- Process: Contact People & Culture team

## License

Proprietary - Eternity School of Egypt © 2025
