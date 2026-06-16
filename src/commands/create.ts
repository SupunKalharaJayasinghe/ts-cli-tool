import type { Command } from 'commander';
import { generateBasicProject } from '../generators/generateBasicProject.js';
import { askBasicScaffoldOptions } from '../prompts/askBasicScaffoldOptions.js';

export function registerCreateCommand(program: Command): void {
  program
    .command('create')
    .description('Scaffolds a new project directory structure')
    .action(async () => {
      console.log("\nLet's build a new project! 🛠️\n");

      try {
        const options = await askBasicScaffoldOptions();

        console.log(`\nScaffolding project in ${options.targetPath}...`);

        await generateBasicProject(options);

        console.log('\n✅ Enterprise project successfully scaffolded!');
        console.log('\nNext steps:');
        console.log(`  cd ${options.projectName}`);
        console.log('  npm install\n');
      } catch (error) {
        console.error('\n❌ Failed to scaffold the project:', error);
        process.exit(1);
      }
    });
}
