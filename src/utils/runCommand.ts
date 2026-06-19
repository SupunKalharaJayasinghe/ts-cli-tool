import { spawn } from 'node:child_process';
import path from 'node:path';

const ALLOWED_COMMANDS = {
  npm: process.platform === 'win32' ? 'npm.cmd' : 'npm',
  npx: process.platform === 'win32' ? 'npx.cmd' : 'npx',
} as const;

type AllowedCommand = keyof typeof ALLOWED_COMMANDS;

export async function runCommand(
  command: AllowedCommand,
  args: string[],
  cwd: string
): Promise<void> {
  const resolvedCommand = ALLOWED_COMMANDS[command];
  if (!resolvedCommand) {
    throw new Error(`Unapproved command execution blocked: ${command}`);
  }

  // Sanity check arguments for command injection sequences
  for (const arg of args) {
    if (/[\n\r;&|`$%^]/u.test(arg)) {
      throw new Error(`Potential command injection attempt blocked in argument: ${arg}`);
    }
  }

  await new Promise<void>((resolve, reject) => {
    const child =
      process.platform === 'win32'
        ? spawn(
            getWindowsCommandProcessor(),
            ['/d', '/s', '/c', buildWindowsCommand(resolvedCommand, args)],
            {
              cwd,
              stdio: 'inherit',
              shell: false,
            }
          )
        : spawn(resolvedCommand, args, {
            cwd,
            stdio: 'inherit',
            shell: false,
          });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${resolvedCommand} ${args.join(' ')} failed with code ${code}`));
    });
  });
}

function getWindowsCommandProcessor(): string {
  return (
    process.env.ComSpec ??
    path.join(
      process.env.SystemRoot ?? process.env.WINDIR ?? 'C:\\Windows',
      'System32',
      'cmd.exe'
    )
  );
}

function buildWindowsCommand(command: string, args: string[]): string {
  return [command, ...args].map(quoteWindowsArg).join(' ');
}

function quoteWindowsArg(value: string): string {
  if (value.length === 0) {
    return '""';
  }

  if (!/[\s"\\]/u.test(value)) {
    return value;
  }

  const escapedValue = value
    .replace(/\\/gu, '\\\\')
    .replace(/"/gu, '\\"');

  return `"${escapedValue}"`;
}