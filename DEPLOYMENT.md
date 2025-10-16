# ESE Evaluation & Recognition - Deployment Guide

## Prerequisites

- Railway account (or any PostgreSQL hosting service)
- GitHub account with the repository
- Node.js 20+ installed locally for development

## Railway Deployment Steps

### 1. Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init
```

### 2. Add PostgreSQL Database

1. In Railway dashboard, click "New" → "Database" → "PostgreSQL"
2. The `DATABASE_URL` will be automatically added to your environment

### 3. Configure Environment Variables

In Railway dashboard, add the following variables:

```env
# Database (automatically set)
DATABASE_URL=postgresql://...

# NextAuth (Required)
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-very-long-random-secret-min-32-chars

# Admin Setup (Required)
ADMIN_EMAIL=admin@ese-school.edu.eg

# Email Provider (Optional but recommended)
EMAIL_SERVER=smtp://username:password@smtp.gmail.com:587
EMAIL_FROM=noreply@ese-school.edu.eg

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Timezone
TZ=Africa/Cairo

# Node Environment
NODE_ENV=production
```

### 4. Deploy Application

```bash
# Push to Railway
railway up

# Or connect to GitHub
# In Railway dashboard:
# 1. Click "Deploy from GitHub repo"
# 2. Select your repository
# 3. Railway will auto-deploy on every push to main
```

### 5. Run Database Migrations

```bash
# Using Railway CLI
railway run npm run prisma:deploy

# Or via Railway dashboard
# Go to Settings → Deploy Hooks → Run Command
# Command: npm run prisma:deploy
```

### 6. Seed Database

```bash
# Using Railway CLI
railway run npm run seed

# This creates:
# - 5 EOM categories
# - 8 MRE rater contexts
# - 5 MRE domains
# - Admin user (CEO)
# - P&C user
# - Sample staff users
```

### 7. Verify Deployment

1. Open your Railway app URL
2. Try signing in with admin email
3. Check server logs for magic link (if email not configured)
4. Verify all pages load correctly

## Alternative Deployment: Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy to Vercel

```bash
# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... add all other env vars

# Deploy to production
vercel --prod
```

### 3. Database Setup

Since Vercel doesn't provide PostgreSQL:
1. Use Railway, Neon, or Supabase for PostgreSQL
2. Get the DATABASE_URL
3. Run migrations locally: `DATABASE_URL=your-url npm run prisma:deploy`
4. Seed: `DATABASE_URL=your-url npm run seed`

## Docker Deployment

### Dockerfile

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ese_user
      POSTGRES_PASSWORD: ese_password
      POSTGRES_DB: ese_eval
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://ese_user:ese_password@postgres:5432/ese_eval
      NEXTAUTH_URL: http://localhost:3000
      NEXTAUTH_SECRET: your-secret-key
      ADMIN_EMAIL: admin@ese-school.edu.eg
      TZ: Africa/Cairo
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Check all environment variables are set
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Test admin login
- [ ] Verify all pages load without errors
- [ ] Test authentication flow
- [ ] Check cron jobs are scheduled (if applicable)
- [ ] Test PDF certificate generation
- [ ] Verify responsive design on mobile
- [ ] Check browser console for errors
- [ ] Test RBAC (different user roles)
- [ ] Monitor error logs
- [ ] Set up backup strategy for database
- [ ] Configure domain name (if not using Railway subdomain)
- [ ] Enable HTTPS (automatic on Railway/Vercel)
- [ ] Set up monitoring/alerts

## Cron Jobs in Production

Railway and Vercel don't run persistent Node processes. Options:

### Option 1: External Cron Service

Use a service like cron-job.org or EasyCron to hit your API endpoints:

```bash
# Create API endpoints for cron tasks
GET /api/cron/eom-open-nominations
GET /api/cron/eom-open-voting
GET /api/cron/eom-close-voting
```

### Option 2: Railway Cron Plugin

Railway has a cron plugin that can trigger scheduled tasks.

### Option 3: Separate Worker Service

Deploy the cron runner as a separate Railway service:

```json
{
  "name": "ese-cron-worker",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run cron"
  }
}
```

## Troubleshooting

### Database Connection Issues

```bash
# Test connection
railway run npx prisma db push
```

### Migration Failures

```bash
# Reset database (WARNING: destroys all data)
railway run npx prisma migrate reset

# Or manually fix migrations
railway run npx prisma migrate resolve --applied "20250116000000_init"
```

### NextAuth Issues

- Ensure NEXTAUTH_URL matches your actual domain
- NEXTAUTH_SECRET must be at least 32 characters
- Check that email provider credentials are correct

### Build Failures

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm ci

# Rebuild
npm run build
```

## Monitoring & Maintenance

### Railway Logs

```bash
# View logs
railway logs

# Follow logs
railway logs --follow
```

### Database Backups

```bash
# Export database
railway run pg_dump $DATABASE_URL > backup.sql

# Restore database
railway run psql $DATABASE_URL < backup.sql
```

### Performance Monitoring

Consider adding:
- Sentry for error tracking
- Vercel Analytics for page performance
- LogRocket for session replay
- Prisma Pulse for database monitoring

## Security Recommendations

- [ ] Use strong NEXTAUTH_SECRET
- [ ] Enable HTTPS only (Railway/Vercel do this automatically)
- [ ] Set secure headers in next.config.js
- [ ] Implement rate limiting on API routes
- [ ] Regular security updates: `npm audit fix`
- [ ] Monitor access logs
- [ ] Implement IP whitelisting if needed
- [ ] Use environment variables, never commit secrets
- [ ] Regular database backups
- [ ] Implement proper CORS policies
