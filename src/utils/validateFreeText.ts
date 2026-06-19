export interface ValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateFreeText(
  value: string,
  opts: { maxLength: number; fieldName: string }
): ValidationResult {
  if (value.length > opts.maxLength) {
    return { valid: false, reason: `${opts.fieldName} must be ${opts.maxLength} characters or fewer.` };
  }

  // Reject control characters other than tab/newline/carriage return.
  // \x1B (ESC) is the one that matters most — it starts ANSI/VT100
  // escape sequences, which could manipulate terminal output if this
  // value is ever printed directly in a console summary.
  // eslint-disable-next-line no-control-regex
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(value)) {
    return { valid: false, reason: `${opts.fieldName} contains invalid control characters.` };
  }

  return { valid: true };
}

export function validateFreeTextPrompt(
  value: string,
  opts: { maxLength: number; fieldName: string }
): true | string {
  const result = validateFreeText(value, opts);
  return result.valid ? true : (result.reason ?? 'Invalid input.');
}
