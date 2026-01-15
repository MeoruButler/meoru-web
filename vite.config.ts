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
			outdir: './src/lib/paraglide',
			// locale 결정 우선순위:
			// 1) 사용자가 선택한 값(쿠키) → 2) 브라우저/요청 헤더 선호 언어 → 3) 기본(ko)
			strategy: ['cookie', 'preferredLanguage', 'baseLocale']
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
