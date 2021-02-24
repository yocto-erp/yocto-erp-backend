const IPFS = require('ipfs')
const os = require('os')

let node;

export async function initIPFS() {
  node = await IPFS.create({
    repo: `${os.homedir()}/.jsipfs2`,
    config: {
      Addresses: {
        Swarm: [
          `/ip4/0.0.0.0/tcp/4001`,
          `/ip4/127.0.0.1/tcp/4003/ws`
        ],
        API: '/ip4/127.0.0.1/tcp/5001',
        Gateway: `/ip4/127.0.0.1/tcp/0`
      },
      Bootstrap: [],
      "API": {
        "HTTPHeaders": {
          "Access-Control-Allow-Origin": [
            "http://127.0.0.1:3000"
          ]
        }
      }
    }
  })
}

export async function addIPFS(data) {
  const _data = JSON.stringify(data);
  const {cid} = await node.add(_data);

  return cid.toString();
}

