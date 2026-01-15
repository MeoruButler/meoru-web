import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import istanbul from 'vite-plugin-istanbul';
import { paraglideVitePlugin } from '@inlang/paraglide-js';

export default defineConfig({
	plugins: [
		tailwindcss(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide'
		}),
		sveltekit(),
		istanbul({
			include: 'src/**/*',
			exclude: ['node_modules', 'test/', 'tests/', 'src/lib/paraglide/**'],
			extension: ['.js', '.ts', '.svelte'],
			requireEnv: false,
			forceBuildInstrument: process.env.VITE_COVERAGE === 'true'
		})
	]
});
