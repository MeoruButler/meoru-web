// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

declare module '$env/static/private' {
	export const SPOTIFY_CLIENT_ID: string;
	export const SPOTIFY_CLIENT_SECRET: string;
	export const SPOTIFY_REFRESH_TOKEN: string;
}
