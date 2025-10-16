import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function getAcademicTerm(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  
  // T1: Sep-Dec, T2: Jan-Apr, T3: May-Aug
  if (month >= 9 && month <= 12) return `${year}-T1`;
  if (month >= 1 && month <= 4) return `${year}-T2`;
  return `${year}-T3`;
}
