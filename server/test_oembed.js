const axios = require('axios');
axios.get('https://open.spotify.com/oembed?url=https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT')
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
