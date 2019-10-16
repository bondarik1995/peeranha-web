import IpfsApi from 'ipfs-api';

import { IPFS_URL } from './constants';

export function getIpfsApi() {
  return IpfsApi({
    host: process.env.IPFS_HOST,
    port: process.env.IPFS_PORT,
    protocol: process.env.IPFS_PROTOCOL,
  });
}

export async function saveText(text) {
  const buf = Buffer.from(text, 'utf8');
  const saveResult = await getIpfsApi().add(buf);
  return saveResult[0].hash;
}

export async function saveFile(file) {
  const buf = Buffer.from(file);
  const saveResult = await getIpfsApi().add(buf);
  return saveResult[0].hash;
}

export async function getText(hash) {
  const getResult = await getIpfsApi().get(hash);
  return getResult[0].content.toString('utf8');
}

export function getFileUrl(fileHash) {
  if (window.renderedByPuppeteer) {
    return null;
  }

  return `${IPFS_URL}/${fileHash}`;
}
