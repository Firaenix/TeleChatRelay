import https = require('https');

export function downloadFileAndTriggerAction(url: string, action: (Uint8Array) => void) {
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d: Uint8Array) => {
      if (action) {
        action(d);
      }
    });

  }).on('error', (e) => {
    console.error(e);
  });
}