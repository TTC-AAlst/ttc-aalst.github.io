export const config = {
  ga: 'G-DFM5137DWX',
  backend: 'https://itenium-test.synology.me:1701',
  version: 'v1.0',
  images: 'https://itenium-test.synology.me:1701',
};

export const devUrl = 'http://localhost:5193';

export function getStaticFileUrl(path: string) {
  return window.location.hostname !== 'localhost'
    ? `${config.images}${path}`
    : `${devUrl}${path}`;
}
