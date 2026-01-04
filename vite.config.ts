import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		istanbul({
			include: 'src/**/*',
			exclude: ['node_modules', 'test/', 'tests/'],
			extension: ['.js', '.ts', '.svelte'],
			requireEnv: false,
			forceBuildInstrument: process.env.VITE_COVERAGE === 'true'
		})
	]
});
