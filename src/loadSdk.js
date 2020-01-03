import loadScript from 'load-script2';

let sdk = false;

export default function loadSdk() {
  if (!sdk) {
    if (typeof window.DM === 'object' && typeof window.DM.player === 'function') {
      // A Dailymotion SDK is already loaded, so reuse that
      sdk = Promise.resolve(window.DM);
    } else {
      sdk = new Promise((resolve, reject) => {
        loadScript('https://api.dmcdn.net/all.js', (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(window.DM);
          }
        });
      });
    }
  }
  return sdk;
}
