import { confirm, input } from '@inquirer/prompts';
import path from 'node:path';
import type { BasicScaffoldOptions } from '../types.js';
import { pathExists } from '../utils/pathExists.js';
import { validateProjectNamePrompt } from '../utils/validateProjectName.js';

export async function askBasicScaffoldOptions(): Promise<BasicScaffoldOptions> {
  const projectName = await input({
    message: 'What is the name of your project?',
    default: 'my-new-app',
    validate: validateProjectNamePrompt,
  });

  const useTypeScript = await confirm({
    message: 'Would you like to initialize this as a TypeScript project?',
    default: true,
  });

  const includeLint = await confirm({
    message: 'Would you like to add ESLint for code quality?',
    default: true,
  });

  const includeJest = await confirm({
    message: 'Would you like to add Jest for automated testing?',
    default: true,
  });

  const includeDocker = await confirm({
    message: 'Would you like to generate a Dockerfile for containerization?',
    default: false,
  });

  return {
    projectName,
    targetPath: path.join(process.cwd(), projectName),
    useTypeScript,
    includeLint,
    includeJest,
    includeDocker,
  };
}
