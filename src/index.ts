#!/usr/bin/env node

import { Command } from 'commander';
import { registerCreateCommand } from './commands/create.js';
import { registerGreetCommand } from './commands/greet.js';

const program = new Command();

program
  .name('project-cli')
  .description('An intent-based TypeScript project scaffolder')
  .version('1.0.0');

registerGreetCommand(program);
registerCreateCommand(program);

program.parse();
