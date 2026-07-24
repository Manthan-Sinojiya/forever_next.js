const https = require('https');
const fs = require('fs');

https.get('https://foreverhealthcare.in/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('forever.html', data);
    console.log('Saved to forever.html');
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
