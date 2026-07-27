const url = 'https://music-sf67.vercel.app/api/auth/login';
fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
}).then(res => res.json()).then(async data => {
  console.log('Login Response:', data);
  const token = data.token;
  
  console.log('Updating profile...');
  const putRes = await fetch('https://music-sf67.vercel.app/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name: 'Admin Name Updated', avatar: 'https://example.com/new_avatar.jpg' })
  });
  const putData = await putRes.json();
  console.log('Update Response:', putData);
  
  console.log('Logging in again...');
  const login2 = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@gmail.com', password: 'admin123' })
  });
  console.log('Second Login:', await login2.json());
});
