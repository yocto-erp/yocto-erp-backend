const IPFS = require('ipfs')

let node;

export async function initIPFS() {
  node = await IPFS.create()
}

export async function addIPFS(data) {
  const _data = JSON.stringify(data);
  const {cid} = await node.add(_data);

  return cid.toString();
}

