export const config = {
  ga: 'G-DFM5137DWX',
  backend: 'https://itenium-test.synology.me:1701',
  version: 'v1.0',
  images: 'https://itenium-test.synology.me:1701',
};

export const devUrl = 'http://localhost:5193';

export function isDev() {
  return window.location.hostname === 'localhost' || window.location.hostname.startsWith('192.168.');
}

export function getSignalRUrl() {
  return isDev()
    ? `${devUrl}/hubs/ttc`
    : `${config.backend}/hubs/ttc`;
}


export function getStaticFileUrl(path: string) {
  return isDev()
    ? `${devUrl}${path}`
    : `${config.images}${path}`;
}
