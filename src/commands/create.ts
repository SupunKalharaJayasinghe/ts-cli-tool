import type { Command } from 'commander';
import { applyPlan } from '../generators/applyPlan.js';
import { createNextBase } from '../generators/createNextBase.js';
import { askCreatePlan } from '../prompts/askCreatePlan.js';
import { pathExists } from '../utils/pathExists.js';
import { runCommand } from '../utils/runCommand.js';

export function registerCreateCommand(program: Command): void {
  program
    .command('create')
    .description('Create an intent-based project scaffold')
    .action(async () => {
      console.log('\n🚀 Let’s create a new project.\n');

      try {
        const plan = await askCreatePlan();

        if (await pathExists(plan.targetPath)) {
          console.error(
            `\n❌ A folder named "${plan.projectName}" already exists. Please choose a different name.`
          );

          process.exit(1);
        }

        console.log('\n📦 Creating Next.js base project...\n');
        await createNextBase(plan);

        console.log('\n🧱 Applying project blueprint...\n');
        await applyPlan(plan);

        if (plan.installDependencies) {
          console.log('\n📥 Installing dependencies...\n');

          const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

          await runCommand(npmCommand, ['install'], plan.targetPath);
        }

        console.log('\n✅ Project successfully created!\n');
        console.log('Next steps:');
        console.log(`  cd ${plan.projectName}`);

        if (!plan.installDependencies) {
          console.log('  npm install');
        }

        if (plan.modules.includes('env-example')) {
          console.log('  cp .env.example .env');
          console.log('  # Windows PowerShell: Copy-Item .env.example .env');
        }

        if (plan.modules.includes('prisma')) {
          console.log('  npm run db:push');
        }

        console.log('  npm run dev\n');
      } catch (error) {
        console.error('\n❌ Failed to create project.');
        console.error(error);
        process.exit(1);
      }
    });
}
