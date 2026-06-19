import { describe, it, expect } from 'vitest';
import { validateProjectName } from './validateProjectName.js';

describe('validateProjectName', () => {
  it('accepts a normal name', () => {
    expect(validateProjectName('my-app').valid).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(validateProjectName('').valid).toBe(false);
  });

  it('rejects path traversal sequences', () => {
    expect(validateProjectName('../../etc/passwd').valid).toBe(false);
    expect(validateProjectName('..').valid).toBe(false);
  });

  it('rejects absolute paths', () => {
    expect(validateProjectName('/etc/passwd').valid).toBe(false);
    expect(validateProjectName('C:\\Windows').valid).toBe(false);
  });

  it('rejects Windows reserved device names, case-insensitively', () => {
    expect(validateProjectName('CON').valid).toBe(false);
    expect(validateProjectName('con').valid).toBe(false);
    expect(validateProjectName('COM1').valid).toBe(false);
    expect(validateProjectName('NUL.txt').valid).toBe(false);
  });

  it('rejects names over the length limit', () => {
    expect(validateProjectName('a'.repeat(101)).valid).toBe(false);
  });

  it('rejects names starting with a hyphen or underscore', () => {
    expect(validateProjectName('-my-app').valid).toBe(false);
    expect(validateProjectName('_my-app').valid).toBe(false);
  });
});
