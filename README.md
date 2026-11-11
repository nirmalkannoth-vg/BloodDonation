# Blood Donation NGO Management Platform

A production-ready Blood Donation NGO Management Platform built with Next.js 16, TypeScript, Neon Postgres, and Drizzle ORM. This platform provides a public website for blood availability and donor registration, alongside a comprehensive admin dashboard for managing donors, blood requests, content, and more.

## Features

### Public Website
- **Homepage** - Blood availability display (aggregated counts only), health content carousel, and CTAs
- **Donor Registration** - Multi-step form with validation and eligibility calculation
- **Blood Request** - Emergency blood request submission with reference number generation
- **Health Awareness** - Published healthcare content with category filtering
- **About Us** - NGO information and mission
- **Contact** - Contact form and NGO details
- **Privacy Policy & Terms** - Legal pages

### Admin Dashboard
- **Dashboard** - Statistics, charts, and key metrics
- **Donor Management** - Search, filter, verify, and manage donors
- **Request Management** - Track blood requests with status management and internal notes
- **Content CMS** - Create and manage health awareness content
- **Notifications** - System notifications for important events
- **Admin Users** - Super Admin can manage other admin accounts
- **Audit Logs** - Complete audit trail of all admin actions
- **Settings** - Application configuration management

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Language**: TypeScript (Strict Mode)
- **Database**: PostgreSQL (via Neon)
- **ORM**: Drizzle ORM
- **Authentication**: Email/password with database-backed sessions (scrypt hashes, httpOnly cookie)
- **UI Components**: shadcn/ui with Base UI
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

## Project Structure

```
blood-donation-ngo/
├── src/
│   ├── app/
│   │   ├── (public)/           # Public website routes
│   │   ├── admin/              # Admin dashboard routes
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── public/             # Public website components
│   │   ├── admin/              # Admin dashboard components
│   │   └── forms/              # Form components
│   ├── actions/                # Server actions
│   ├── services/               # Business logic services
│   ├── db/
│   │   ├── schema/             # Drizzle schema files
│   │   ├── migrations/         # SQL migrations
│   │   ├── seed.ts             # Development seed data
│   │   └── index.ts            # Database client
│   ├── lib/
│   │   ├── auth/               # Password hashing, sessions, admin guards
│   │   ├── validations/        # Zod schemas
│   │   └── security/           # Rate limiting
│   ├── types/                  # TypeScript types
│   └── config/                 # App configuration
├── public/                     # Static assets
├── drizzle.config.ts           # Drizzle configuration
├── .env.example                # Environment variables template
└── package.json
```

## Prerequisites

- Node.js 18.17 or later
- npm or pnpm
- A Neon project (free tier works)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd blood-donation-ngo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Neon

1. Create a new project at [neon.tech](https://neon.tech)
2. Click **Connect** and copy the **pooled** connection string (host contains `-pooler`)

### 4. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Neon connection string:

```bash
# Neon Postgres (Server-only - NEVER expose to client)
DATABASE_URL=postgresql://[user]:[password]@[endpoint]-pooler.[region].aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Optional: Rate limiting (Upstash Redis)
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=
```

### 5. Set Up the Database

Generate and run migrations:

```bash
npm run db:push
```

Seed initial data (blood groups, sample content, etc.):

```bash
npm run db:seed
```

### 6. Create Your First Admin User

```bash
npm run script:create-admin -- "<email>" "<full_name>" "<password>" SUPER_ADMIN
```

The password (min. 8 characters) is stored as a scrypt hash in `admin_users`.
Re-running the command with the same email updates the name/role and resets the password.
See [scripts/README.md](scripts/README.md) for details.

### 7. Start Development Server

```bash
npm run dev
```

Visit:
- Public website: http://localhost:3000
- Admin dashboard: http://localhost:3000/admin

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema directly to database |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with initial data |

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `blood_groups` | Blood types (A+, A-, B+, etc.) |
| `donors` | Registered blood donors |
| `blood_requests` | Blood request submissions |
| `content` | Health awareness content items |
| `admin_users` | Admin dashboard users (email + password hash) |
| `admin_sessions` | Active admin login sessions (hashed tokens) |
| `notifications` | System notifications |
| `settings` | Application configuration |
| `audit_logs` | Action audit trail |

### Key Enums

- **donor_status**: PENDING, ACTIVE, INACTIVE, DEACTIVATED
- **verification_status**: UNVERIFIED, VERIFIED
- **request_status**: PENDING, CONTACTED, IN_PROGRESS, FULFILLED, CANCELLED
- **urgency**: NORMAL, URGENT, EMERGENCY
- **admin_role**: ADMIN, SUPER_ADMIN
- **content_status**: DRAFT, PUBLISHED, ARCHIVED

## Security Features

### Privacy Protection
- Public endpoints only return aggregated data (counts by blood group)
- No donor PII is exposed on the public website
- Donor details are only accessible to authenticated admins

### Authentication & Authorization
- Email/password login; passwords hashed with scrypt (Node `crypto`)
- Sessions stored in the `admin_sessions` table; the browser only holds a random token in an httpOnly, SameSite=Lax cookie (7-day expiry), and only its SHA-256 hash is stored
- Login attempts rate-limited per IP + email
- Role-based access control (ADMIN, SUPER_ADMIN)
- Server-side session validation on all admin routes (`requireAdmin()`)
- Proxy (`src/proxy.ts`) redirects to login when no session cookie is present

### Data Validation
- Zod schemas for all form inputs
- Server-side validation in all server actions
- Parameterized queries via Drizzle ORM (SQL injection prevention)

### Audit Trail
- All admin actions are logged
- Audit logs include: action, entity, admin, timestamp, metadata

### Rate Limiting
- In-memory rate limiting for public form submissions
- Configurable via Upstash Redis for production

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
4. Deploy!

### Production Checklist

- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] At least one SUPER_ADMIN user exists
- [ ] Blood groups are seeded
- [ ] Default settings are configured
- [ ] Custom domain is configured (optional)
- [ ] `DATABASE_URL` is kept server-only (never prefixed with `NEXT_PUBLIC_`)

### Database Access

The database lives in Neon and is only reachable through `DATABASE_URL` from server code
(Server Components, Server Actions, scripts). It is not exposed through a public REST API,
so row-level security policies are not required. Keep the connection string secret and
rotate the password from the Neon dashboard if it is ever leaked.

## Configuration

### Application Settings

Settings are stored in the `settings` table and can be managed via the admin dashboard:

| Key | Description | Default |
|-----|-------------|---------|
| `NGO_NAME` | Organization name | LifeBlood Foundation |
| `NGO_DESCRIPTION` | Organization description | - |
| `CONTACT_EMAIL` | Contact email address | - |
| `CONTACT_PHONE` | Contact phone number | - |
| `CONTACT_ADDRESS` | Physical address | - |
| `DONATION_ELIGIBILITY_INTERVAL_DAYS` | Days between donations | 90 |

### Landing Page Images

The home page hero shows `public/images/hero-donor.png` if it exists (landscape, ~1600×1000,
on a flat `#F0F0F1` background — the hero section uses the same colour so the photo blends in).
Until it is added, an SVG blood-drop illustration is shown instead. No restart is needed.

The Health Awareness and About pages use free stock photos in `public/images/awareness/`
(Unsplash License / Pexels License — free for commercial use, no attribution required).
By design **no photo shows a human face** — keep it that way when replacing them.

| File | Source |
|------|--------|
| `blood-bag.jpg` | [Unsplash – Aman Chaturvedi](https://unsplash.com/photos/0ZZo5o00o80) |
| `blood-tubes-lab.jpg` | [Unsplash – Testalize.me](https://unsplash.com/photos/0jE8ynV4mis) |
| `donor-arm-blood-bags.jpg` | [Pexels – Tahir Xəlfəquliyev](https://www.pexels.com/photo/blood-donation-process-in-a-clinic-setting-37553387/) |
| `blood-vials-rack.jpg` | [Pexels – Tahir Xəlfəquliyev](https://www.pexels.com/photo/blood-sample-vials-in-laboratory-rack-37548861/) |
| `gloved-hands-sample.jpg` | [Pexels – Los Muertos Crew](https://www.pexels.com/photo/a-person-holding-vacutainer-8460340/) |
| `blood-bags-types.jpg` | [Pexels – Charlie-Helen Robinson](https://www.pexels.com/photo/bags-of-blood-4531307/) |

Replace any of them with your own photos by keeping the same file name.

Footer social icons (Facebook, YouTube, LinkedIn, Instagram, X) only appear for links set in
**Admin → Settings → Social Media**.

### Design System

The platform uses a red/white healthcare theme:
- **Primary**: Red (`#DC2626` / Tailwind `red-600`)
- **Background**: White with subtle gray sections
- **Cards**: White with subtle shadows

## Medical Disclaimer

This platform is designed for administrative tracking and coordination of blood donation activities only. It does not provide medical advice, diagnosis, or treatment recommendations. All medical decisions should be made by qualified healthcare professionals.

## License

[MIT License](LICENSE)

## Support

For questions or support, please open an issue in the repository.
