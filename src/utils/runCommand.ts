import { spawn } from 'node:child_process';

export async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const fullCommand = [command, ...args].map(quoteArg).join(' ');
    const child = spawn(fullCommand, {
      cwd,
      stdio: 'inherit',
      shell: true,
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(`${command} ${args.join(' ')} failed with code ${code}`)
      );
    });
  });
}

function quoteArg(value: string): string {
  if (!/[\s"]/u.test(value)) {
    return value;
  }

  return `"${value.replace(/"/gu, '\\"')}"`;
}
