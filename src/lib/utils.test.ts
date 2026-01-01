import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
	describe('cn', () => {
		it('merges class names correctly', () => {
			expect(cn('w-full', 'h-full')).toBe('w-full h-full');
		});

		it('handles conditional classes', () => {
			expect(cn('w-full', true && 'h-full', false && 'text-red-500')).toBe('w-full h-full');
		});

		it('resolves tailwind conflicts efficiently', () => {
			// tailwind-merge should ensure 'p-4' overwrites 'p-2'
			expect(cn('p-2', 'p-4')).toBe('p-4');
			expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
		});

		it('handles arrays and objects inputs like clsx', () => {
			expect(cn(['foo', 'bar'], { baz: true, qux: false })).toBe('foo bar baz');
		});
	});
});
