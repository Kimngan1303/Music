const { getTracks } = require('spotify-url-info')(fetch);

async function test() {
  const tracks = await getTracks('https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M'); // Today's Top Hits
  console.log(tracks[0]);
}
test();
