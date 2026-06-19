import type { CreatePlan } from '../types.js';
import { runCommand } from '../utils/runCommand.js';

export async function createNextBase(plan: CreatePlan): Promise<void> {
  await runCommand(
    'npx',
    [
      'create-next-app@latest',
      plan.projectName,
      '--ts',
      '--tailwind',
      '--eslint',
      '--app',
      '--src-dir',
      '--import-alias',
      '@/*',
      '--use-npm',
      '--skip-install',
      '--disable-git',
      '--yes',
      '--no-agents-md',
    ],
    process.cwd()
  );
}
