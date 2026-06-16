import path from 'node:path';
import type { CreatePlan } from '../types.js';
import { writeFileSafe } from '../utils/files.js';
import { toTitle } from '../utils/strings.js';

export async function applyFullstackPlan(plan: CreatePlan): Promise<void> {
  if (plan.blueprint !== 'fullstack-product') {
    throw new Error(
      'applyFullstackPlan can only be used with fullstack-product plans.'
    );
  }

  await writeLayout(plan);
  await writeHomePage(plan);
  await writeDashboardPage(plan);
  await writeDashboardComponents(plan);
  await writeHealthRoute(plan);
  await writeServerFiles(plan);
  await writeLibFiles(plan);
  await writeTypesFile(plan);
}

async function writeLayout(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/layout.tsx'),
    `import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: '${toTitle(plan.projectName)}',
  description: 'Generated full-stack product starter.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`
  );
}

async function writeHomePage(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/page.tsx'),
    `import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6">
      <p className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
        Full-stack product starter
      </p>

      <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-slate-950">
        ${toTitle(plan.projectName)}
      </h1>

      <p className="mt-4 max-w-2xl text-slate-600">
        A production-shaped starter with dashboard structure, server logic,
        API routes, and space for database-backed features.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/dashboard"
          className="rounded-md bg-slate-950 px-5 py-3 text-sm font-medium text-white"
        >
          Open dashboard
        </Link>

        <Link
          href="/api/health"
          className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
        >
          Check API health
        </Link>
      </div>
    </main>
  );
}
`
  );
}

async function writeDashboardPage(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/dashboard/page.tsx'),
    `import { DashboardShell } from '@/components/dashboard/DashboardShell';
import { StatCard } from '@/components/dashboard/StatCard';

export default function DashboardPage() {
  return (
    <DashboardShell
      title="Dashboard"
      description="Start building your product dashboard here."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Users" value="0" />
        <StatCard label="Revenue" value="$0" />
        <StatCard label="Activity" value="0%" />
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          Product workspace
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Replace this placeholder with tables, charts, forms, or product-specific workflows.
        </p>
      </section>
    </DashboardShell>
  );
}
`
  );
}

async function writeDashboardComponents(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/dashboard/DashboardShell.tsx'),
    `import type { ReactNode } from 'react';

interface DashboardShellProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function DashboardShell({
  title,
  description,
  children,
}: DashboardShellProps) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-slate-500">
          Product
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">
          {title}
        </h1>
        <p className="mt-3 text-slate-600">{description}</p>
      </div>

      {children}
    </main>
  );
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/components/dashboard/StatCard.tsx'),
    `interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}
`
  );
}

async function writeHealthRoute(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/app/api/health/route.ts'),
    `export async function GET() {
  return Response.json({
    ok: true,
    service: '${plan.projectName}',
    blueprint: 'fullstack-product',
    timestamp: new Date().toISOString(),
  });
}
`
  );
}

async function writeServerFiles(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/server/actions/index.ts'),
    `export async function exampleAction() {
  return {
    ok: true,
    message: 'Server action placeholder',
  };
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/server/services/productService.ts'),
    `export interface ProductSummary {
  name: string;
  blueprint: string;
}

export function getProductSummary(): ProductSummary {
  return {
    name: '${plan.projectName}',
    blueprint: 'fullstack-product',
  };
}
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/server/services/index.ts'),
    `export { getProductSummary } from './productService.js';
export type { ProductSummary } from './productService.js';
`
  );
}

async function writeLibFiles(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/lib/env.ts'),
    `export const env = {
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL,
} as const;
`
  );

  await writeFileSafe(
    path.join(plan.targetPath, 'src/lib/utils.ts'),
    `export function formatAppName(value: string): string {
  return value
    .split(/[-_\\s]+/)
    .filter(Boolean)
    .map((part) => \`\${part.charAt(0).toUpperCase()}\${part.slice(1)}\`)
    .join(' ');
}
`
  );
}

async function writeTypesFile(plan: CreatePlan): Promise<void> {
  await writeFileSafe(
    path.join(plan.targetPath, 'src/types/product.ts'),
    `export type ProductBlueprint = 'saas' | 'dashboard' | 'custom';

export interface ProductConfig {
  name: string;
  blueprint: ProductBlueprint;
}
`
  );
}
