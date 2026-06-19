import crypto from 'node:crypto';

export function generateSecret(bytes = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}
