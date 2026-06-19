import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { assertPathSafe, UnsafePathError } from './files.js';

describe('assertPathSafe', () => {
  const root = path.resolve('/home/user/project');

  it('allows a path inside root', () => {
    expect(() => assertPathSafe(path.join(root, 'src/index.ts'), root)).not.toThrow();
  });

  it('allows root itself', () => {
    expect(() => assertPathSafe(root, root)).not.toThrow();
  });

  it('rejects a sibling directory with a similar prefix', () => {
    // This is the regression test for the startsWith() bug specifically:
    // "project-evil" starts with the string "project" but is not
    // contained within it as a path.
    const sibling = path.resolve('/home/user/project-evil/payload.txt');
    expect(() => assertPathSafe(sibling, root)).toThrow(UnsafePathError);
  });

  it('rejects parent traversal', () => {
    expect(() => assertPathSafe(path.join(root, '../../etc/passwd'), root)).toThrow(UnsafePathError);
  });

  it('rejects an absolute path entirely outside root', () => {
    expect(() => assertPathSafe('/etc/passwd', root)).toThrow(UnsafePathError);
  });
});
