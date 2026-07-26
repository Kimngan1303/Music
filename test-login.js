fetch('https://music-sf67.vercel.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'madu@gmail.com', password: 'madu' })
}).then(res => res.json()).then(console.log).catch(console.error);
