import { describe, it, expect } from 'vitest';
import { cn, getAcademicTerm } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
      expect(cn('foo', { bar: true })).toBe('foo bar');
      expect(cn('foo', { bar: false })).toBe('foo');
    });
  });

  describe('getAcademicTerm', () => {
    it('should return correct term for September', () => {
      const date = new Date('2025-09-15');
      expect(getAcademicTerm(date)).toBe('2025-T1');
    });

    it('should return correct term for January', () => {
      const date = new Date('2025-01-15');
      expect(getAcademicTerm(date)).toBe('2025-T2');
    });

    it('should return correct term for May', () => {
      const date = new Date('2025-05-15');
      expect(getAcademicTerm(date)).toBe('2025-T3');
    });
  });
});
