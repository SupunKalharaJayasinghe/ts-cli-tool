#!/usr/bin/env node

import { Command } from 'commander';
import { registerCreateCommand } from './commands/create.js';
import { registerGreetCommand } from './commands/greet.js';

const program = new Command();

program
  .name('my-cli')
  .description('A powerful, strongly-typed CLI tool')
  .version('1.0.0');

registerGreetCommand(program);
registerCreateCommand(program);

program.parse();
