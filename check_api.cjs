const https = require('https');
https.get('https://gym-ii9k.vercel.app/', (res) => {
  let d=''; res.on('data', c => d+=c);
  res.on('end', () => {
    const m = d.match(/assets\/index-[a-zA-Z0-9_-]+\.js/);
    if (m) {
      https.get('https://gym-ii9k.vercel.app/' + m[0], (r2) => {
        let d2=''; r2.on('data', c => d2+=c);
        r2.on('end', () => {
          const apiMatch = d2.match(/http[^"']+\/api/);
          console.log('API URL:', apiMatch ? apiMatch[0] : 'not found');
        });
      });
    }
  });
});
