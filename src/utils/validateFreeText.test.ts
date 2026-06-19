import { describe, it, expect } from 'vitest';
import { validateFreeText } from './validateFreeText.js';

describe('validateFreeText', () => {
  it('accepts normal text with spaces and punctuation', () => {
    expect(validateFreeText('My Cool App, v2!', { maxLength: 50, fieldName: 'Title' }).valid).toBe(true);
  });

  it('rejects text over the length limit', () => {
    expect(validateFreeText('a'.repeat(51), { maxLength: 50, fieldName: 'Title' }).valid).toBe(false);
  });

  it('rejects embedded ESC characters', () => {
    expect(validateFreeText('Hello\x1B[31mRed', { maxLength: 50, fieldName: 'Title' }).valid).toBe(false);
  });

  it('allows normal whitespace', () => {
    expect(validateFreeText('Line one\nLine two', { maxLength: 50, fieldName: 'Title' }).valid).toBe(true);
  });
});
