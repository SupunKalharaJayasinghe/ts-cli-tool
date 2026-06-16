# ts-cli-tool

An intent-based TypeScript project scaffolder for generating production-shaped Next.js starter projects.

Instead of only asking low-level setup questions, `ts-cli-tool` asks what kind of project you want to build, creates an official Next.js base project, and then applies a tailored blueprint structure.

## What it does

`ts-cli-tool` helps generate practical starter projects from developer intent.

Current supported blueprints:

- Website
- Full-stack Product
- AI App

The CLI flow:

```txt
my-cli create
↓
Project name
↓
Choose project blueprint
↓
Choose blueprint-specific shape
↓
Choose relevant modules
↓
Create Next.js base project
↓
Apply custom blueprint files
↓
Apply optional feature modules
↓
Optionally install dependencies
↓
Print next steps
```

## Why this exists

Traditional project scaffolding usually starts with framework configuration.

This tool starts with project intent.

For example, instead of only creating a blank Next.js app, the CLI can generate:

- A multi-page website with pages, layout components, contact form placeholder, and SEO files
- A full-stack product starter with dashboard structure, API route placeholders, Prisma/PostgreSQL, Redis, Docker, and GitHub Actions
- An AI app starter with chat UI, API route placeholder, AI configuration, and optional persistence modules

## Installation

Clone the repository:

```bash
git clone https://github.com/SupunKalharaJayasinghe/ts-cli-tool.git
cd ts-cli-tool
```

Install dependencies:

```bash
npm install
```

Build the CLI:

```bash
npm run build
```

Run locally:

```bash
node dist/index.js create
```

Or link it globally for local development:

```bash
npm link
my-cli create
```

## Commands

### `my-cli greet <name>`

Prints a test greeting.

```bash
my-cli greet Supun
```

### `my-cli create`

Starts the project scaffolding flow.

```bash
my-cli create
```

## Blueprint: Website

Use this for public-facing websites.

Examples:

- Landing page
- Portfolio
- Business website
- Documentation-style website

Website options include:

- One-page landing page
- Multi-page website
- Selected sections
- Selected pages
- SEO starter files
- Contact form placeholder
- GitHub Actions CI
- Optional Docker files

Example generated structure:

```txt
src/
├── app/
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── services/page.tsx
│   ├── contact/page.tsx
│   ├── layout.tsx
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── forms/
│   │   └── ContactForm.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
├── lib/
│   └── site-config.ts
└── types/
```

## Blueprint: Full-stack Product

Use this for production-style apps with backend logic.

Examples:

- SaaS starter
- Dashboard app
- Admin-style app
- Custom full-stack product

Full-stack options include:

- SaaS starter
- Dashboard with database
- Custom full-stack app
- Prisma + PostgreSQL
- Redis
- Docker files
- GitHub Actions CI
- Environment example file

Example generated structure:

```txt
src/
├── app/
│   ├── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── api/
│   │   └── health/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   └── dashboard/
├── lib/
│   ├── db.ts
│   ├── env.ts
│   ├── redis.ts
│   └── utils.ts
├── server/
│   ├── actions/
│   └── services/
└── types/

prisma/
└── schema.prisma

.env.example
Dockerfile
docker-compose.yml
.github/workflows/ci.yml
```

## Blueprint: AI App

Use this for AI-first applications.

Examples:

- Chat app
- AI assistant
- Content generator

AI options include:

- Chat app
- AI assistant
- Content generator
- AI API route placeholder
- Chat UI components
- AI config helper
- Optional database support
- Optional Redis support
- GitHub Actions CI

Example generated structure:

```txt
src/
├── app/
│   ├── page.tsx
│   ├── api/
│   │   └── chat/
│   │       └── route.ts
│   └── layout.tsx
├── components/
│   └── chat/
│       ├── Chat.tsx
│       ├── ChatInput.tsx
│       └── MessageList.tsx
├── lib/
│   └── ai.ts
└── types/
    └── ai.ts
```

## Feature modules

The scaffolder can apply optional modules based on the selected blueprint.

### Prisma + PostgreSQL

Adds:

```txt
prisma/schema.prisma
src/lib/db.ts
.env.example
```

Also updates `package.json` with Prisma dependencies and scripts:

```bash
npm run db
npm run db:push
npm run db:generate
```

### Redis

Adds:

```txt
src/lib/redis.ts
REDIS_URL in .env.example
```

### Docker

Adds:

```txt
Dockerfile
docker-compose.yml
```

For projects using PostgreSQL or Redis, Docker Compose includes matching services.

### GitHub Actions

Adds:

```txt
.github/workflows/ci.yml
```

The generated workflow runs install, lint, typecheck, and build steps.

## Generated project next steps

After generating a project:

```bash
cd your-project-name
npm install
npm run dev
```

If `.env.example` is generated:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

If Prisma is enabled:

```bash
npm run db:push
```

## Local development

Install dependencies:

```bash
npm install
```

Run the CLI in development mode:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Run the built CLI:

```bash
node dist/index.js create
```

## Manual verification

Generated projects have been manually verified for:

- Website blueprint
- Full-stack Product blueprint
- AI App blueprint

See:

```txt
docs/generated-project-verification.md
```

## Current limitations

This version focuses on the first stable intent-based scaffolder flow.

Not included yet:

- Authentication implementation
- Payment integration
- Full UI component library
- Deployment automation
- Backend API blueprint
- TypeScript package / CLI blueprint
- Plugin system
- Dry-run mode

These can be added in future versions.

## License

ISC
