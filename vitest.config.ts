import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		globals: true,
		environment: 'jsdom',
		include: ['src/**/*.{test,spec}.{js,ts}'],
		setupFiles: ['src/setupTests.ts'],
		alias: {
			'$env/static/private': path.resolve(__dirname, 'tests/mocks/env.ts'),
			$lib: path.resolve(__dirname, 'src/lib'),
			$shared: path.resolve(__dirname, 'src/shared'),
			$widgets: path.resolve(__dirname, 'src/widgets'),
			$styles: path.resolve(__dirname, 'src/app/styles')
		}
	}
});
