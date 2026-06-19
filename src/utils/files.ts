import fs from 'node:fs/promises';
import path from 'node:path';

export class UnsafePathError extends Error {
  constructor(attemptedPath: string, root: string) {
    super(`Refused to write outside the project root.\n  Root: ${root}\n  Attempted: ${attemptedPath}`);
    this.name = 'UnsafePathError';
  }
}

/**
 * Throws if targetPath resolves outside root. Always resolves both
 * arguments internally — never compare un-resolved strings, and never
 * use String.prototype.startsWith() for this check.
 */
export function assertPathSafe(targetPath: string, root: string = process.cwd()): void {
  const resolvedRoot = path.resolve(root);
  const resolvedTarget = path.resolve(targetPath);
  const rel = path.relative(resolvedRoot, resolvedTarget);

  // rel === ''            → targetPath IS root itself (allowed)
  // rel.startsWith('..')  → escapes root via parent traversal
  // path.isAbsolute(rel)  → on Windows, path.relative() between two
  //                          different drive letters returns the
  //                          absolute `to` path rather than a relative
  //                          one (e.g. relative('C:\foo','D:\bar') ===
  //                          'D:\bar') — must be caught here too.
  const escapesRoot = rel !== '' && (rel.startsWith('..') || path.isAbsolute(rel));

  if (escapesRoot) {
    throw new UnsafePathError(resolvedTarget, resolvedRoot);
  }
}

export async function ensureDir(dirPath: string, root: string = process.cwd()): Promise<void> {
  assertPathSafe(dirPath, root);
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeFileSafe(
  filePath: string,
  content: string,
  root: string = process.cwd()
): Promise<void> {
  assertPathSafe(filePath, root);
  await ensureDir(path.dirname(filePath), root);
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function readJsonFile<T>(filePath: string, root: string = process.cwd()): Promise<T> {
  assertPathSafe(filePath, root);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export async function writeJsonFile(
  filePath: string,
  value: unknown,
  root: string = process.cwd()
): Promise<void> {
  await writeFileSafe(filePath, `${JSON.stringify(value, null, 2)}\n`, root);
}
