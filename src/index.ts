#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { registerCreateCommand } from './commands/create.js';
import { registerGreetCommand } from './commands/greet.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const packageJsonPath = join(__dirname, '../package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

const program = new Command();

program
  .name('project-cli')
  .description('An intent-based TypeScript project scaffolder')
  .version(packageJson.version);

registerGreetCommand(program);
registerCreateCommand(program);

program.parse();
