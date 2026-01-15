import {
	SPOTIFY_CLIENT_ID,
	SPOTIFY_CLIENT_SECRET,
	SPOTIFY_REFRESH_TOKEN
} from '$env/static/private';

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

async function getAccessToken() {
	const response = await fetch(TOKEN_ENDPOINT, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${basic}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: SPOTIFY_REFRESH_TOKEN
		})
	});

	return response.json();
}

export async function getNowPlaying() {
	try {
		const { access_token } = await getAccessToken();

		return fetch(NOW_PLAYING_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
	} catch (error) {
		console.error('Error fetching now playing:', error);
		throw new Error('Failed to fetch now playing');
	}
}

export async function getRecentlyPlayed() {
	try {
		const { access_token } = await getAccessToken();

		return fetch(RECENTLY_PLAYED_ENDPOINT, {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
	} catch (error) {
		console.error('Error fetching recently playing:', error);
		throw new Error('Failed to fetch recently playing');
	}
}
