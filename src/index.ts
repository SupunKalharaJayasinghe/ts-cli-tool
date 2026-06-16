#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();

program
  .name('my-cli')
  .description('A powerful, strongly-typed CLI tool')
  .version('1.0.0');

// Create your very first command
program
  .command('greet')
  .description('Greets the user by name')
  .argument('<name>', 'The name of the person to greet')
  .action((name: string) => {
    console.log(`🚀 Hello, ${name}! Your TypeScript CLI is officially alive.`);
  });

// Parse the arguments from the terminal
program.parse();
