import { spawn } from 'node:child_process';
import path from 'node:path';

export async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const child =
      process.platform === 'win32'
        ? spawn(
            getWindowsCommandProcessor(),
            ['/d', '/s', '/c', buildWindowsCommand(command, args)],
            {
              cwd,
              stdio: 'inherit',
              shell: false,
            }
          )
        : spawn(command, args, {
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

      reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
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