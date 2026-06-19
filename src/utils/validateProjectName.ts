import path from 'node:path';

const WINDOWS_RESERVED = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9',
]);

const NAME_PATTERN = /^[a-z0-9][a-z0-9-_]*$/i;
const MAX_LENGTH = 100;

export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateProjectName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, reason: 'Project name cannot be empty.' };
  }

  const trimmed = name.trim();

  if (trimmed.length > MAX_LENGTH) {
    return { valid: false, reason: `Project name must be ${MAX_LENGTH} characters or fewer.` };
  }

  if (trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) {
    return { valid: false, reason: 'Project name cannot contain path separators or ".." sequences.' };
  }

  if (!NAME_PATTERN.test(trimmed)) {
    return {
      valid: false,
      reason: 'Project name must start with a letter or number, and contain only letters, numbers, hyphens, and underscores.',
    };
  }

  const upperName = trimmed.toUpperCase();
  const baseName = upperName.split('.')[0] || '';
  if (WINDOWS_RESERVED.has(upperName) || WINDOWS_RESERVED.has(baseName)) {
    return { valid: false, reason: `"${trimmed}" is a reserved name on Windows and cannot be used.` };
  }

  const resolved = path.resolve(process.cwd(), trimmed);
  const rel = path.relative(process.cwd(), resolved);
  if (rel === '' || rel.startsWith('..') || path.isAbsolute(rel)) {
    return { valid: false, reason: 'Project name resolves outside the current directory.' };
  }

  return { valid: true };
}

export function validateProjectNamePrompt(name: string): true | string {
  const result = validateProjectName(name);
  return result.valid ? true : (result.reason ?? 'Invalid project name.');
}
