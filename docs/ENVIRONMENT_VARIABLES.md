# Environment Variables

The application requires the following environment variables to be set:

## Database
- `DATABASE_URL`: Connection string for PostgreSQL database
  - Format: `postgresql://username:password@host:port/database?schema=public`
  - Example: `postgresql://postgres:postgres@localhost:5432/ese_eval?schema=public`

## Authentication
- `NEXTAUTH_URL`: Full URL of your site
  - Development: `http://localhost:3000`
  - Production: `https://ese-eval.example.com`
  
- `NEXTAUTH_SECRET`: Random string of at least 32 characters for JWT encryption
  - Generate with: `openssl rand -base64 32`
  - Must be kept secret and secure

## Email (for magic link authentication)
- `EMAIL_SERVER_HOST`: SMTP server hostname
  - Example: `smtp.gmail.com` or `smtp.office365.com`
  
- `EMAIL_SERVER_PORT`: SMTP server port (usually 587 for TLS)
  - Common values: `587` (TLS), `465` (SSL), `25` (unencrypted)
  
- `EMAIL_SERVER_USER`: SMTP username
  - Usually your email address
  
- `EMAIL_SERVER_PASSWORD`: SMTP password
  - For Gmail, use an App Password
  
- `EMAIL_FROM`: From address for emails
  - Example: `noreply@ese-school.edu.eg`

### Alternative Email Configuration
Instead of individual email settings, you can use:
- `EMAIL_SERVER`: Full SMTP connection string
  - Format: `smtp://username:password@host:port`
  - Example: `smtp://user@example.com:password@smtp.example.com:587`

## OAuth (Optional)
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
  - Get from Google Cloud Console
  
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
  - Get from Google Cloud Console

## Optional
- `ADMIN_EMAIL`: Default admin user email (used in seed script)
  - Default: `admin@ese-school.edu.eg`

- `TZ`: Timezone for the application
  - Default: `Africa/Cairo`
  - Format: IANA timezone identifier

## Development Setup

For local development:

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Update the values in `.env.local` with your local settings

3. For development, magic links will be printed to the console if `NODE_ENV=development`

## Production Deployment

1. Set all required environment variables in your hosting platform
2. Ensure `NEXTAUTH_SECRET` is a strong, random value
3. Use a secure SMTP service for email delivery
4. Set `NEXTAUTH_URL` to your production domain
5. Never commit `.env` or `.env.local` files to version control

## Security Notes

- Never expose `NEXTAUTH_SECRET` or `EMAIL_SERVER_PASSWORD`
- Use environment variables, not hardcoded values
- Rotate secrets regularly in production
- Use different values for development and production
- Enable 2FA on your SMTP account for additional security
