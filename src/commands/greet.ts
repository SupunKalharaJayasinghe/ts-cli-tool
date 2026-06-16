import type { Command } from 'commander';

export function registerGreetCommand(program: Command): void {
  program
    .command('greet')
    .description('Greets the user by name')
    .argument('<name>', 'The name of the person to greet')
    .action((name: string) => {
      console.log(
        `🚀 Hello, ${name}! Your TypeScript CLI is officially alive.`
      );
    });
}
