import { Hono } from 'hono';

export const app = new Hono().basePath('/api');

app.get('/health', (c) => {
	return c.json({
		status: 'ok',
		uptime: process.uptime(),
		timestamp: Date.now()
	});
});

app.get('/spotify/now-playing', async (c) => {
	try {
		const { getNowPlaying, getRecentlyPlayed } = await import('./spotify');
		const response = await getNowPlaying();

		// 재생 중이 아니거나 에러인 경우 → recently-played로 fallback
		if (response.status === 204 || response.status > 400) {
			try {
				const recentResponse = await getRecentlyPlayed();

				if (!recentResponse.ok) {
					return c.json({ isPlaying: false });
				}

				const data = await recentResponse.json();

				if (!data.items || data.items.length === 0) {
					return c.json({ isPlaying: false });
				}

				const track = data.items[0].track;

				return c.json({
					isPlaying: false,
					title: track.name,
					artist: track.artists.map((_artist: { name: string }) => _artist.name).join(', '),
					album: track.album.name,
					albumImageUrl: track.album.images[0].url,
					songUrl: track.external_urls.spotify,
					isExplicit: track.explicit
				});
			} catch {
				return c.json({ isPlaying: false });
			}
		}

		const song = await response.json();

		// Check if item is null (can happen even with 200 OK sometimes)
		if (!song.item) {
			return c.json({ isPlaying: false });
		}

		const isPlaying = song.is_playing;
		const title = song.item.name;
		const artist = song.item.artists.map((_artist: { name: string }) => _artist.name).join(', ');
		const album = song.item.album.name;
		const albumImageUrl = song.item.album.images[0].url;
		const songUrl = song.item.external_urls.spotify;

		const isExplicit = song.item.explicit;

		return c.json({
			isPlaying,
			title,
			artist,
			album,
			albumImageUrl,
			songUrl,
			isExplicit
		});
	} catch (error) {
		console.error('Detailed error in /spotify/now-playing:', error);
		return c.json({ isPlaying: false });
	}
});

app.get('/spotify/recent', async (c) => {
	try {
		const { getRecentlyPlayed } = await import('./spotify');
		const response = await getRecentlyPlayed();

		if (!response.ok) {
			throw new Error(`Failed to fetch recent tracks: ${response.status}`);
		}

		const data = await response.json();

		if (!data.items || data.items.length === 0) {
			return c.json({ count: 0 });
		}

		const track = data.items[0].track;
		const title = track.name;
		const artist = track.artists.map((_artist: { name: string }) => _artist.name).join(', ');
		const album = track.album.name;
		const albumImageUrl = track.album.images[0].url;
		const songUrl = track.external_urls.spotify;

		return c.json({
			title,
			artist,
			album,
			albumImageUrl,
			songUrl
		});
	} catch (error) {
		console.error('Detailed error in /spotify/recent:', error);
		return c.json({ count: 0 }); // Fallback to empty
	}
});

// Add more routes or middleware here
