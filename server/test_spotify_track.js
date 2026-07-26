const { getTracks } = require('spotify-url-info')(fetch);

async function test() {
  const tracks = await getTracks('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT'); 
  console.log(tracks);
}
test();
