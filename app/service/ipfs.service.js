import IPFS from 'ipfs'
import HttpApi from 'ipfs-http-server'
import HttpGateway from 'ipfs-http-gateway'

const os = require('os')

let node;

export async function initIPFS() {
  node = await IPFS.create({
    repo: `${os.homedir()}/.jsipfs2`,
    config: {
      API: {
        HTTPHeaders: {
          "Access-Control-Allow-Methods": [
            "PUT", "POST"
          ],
          "Access-Control-Allow-Origin": [
            "http://localhost:3000",
            "https://app.yoctoerp.com",
            "https://webui.ipfs.io"
          ]
        }
      }
    }
  });
  await new HttpApi(node).start();
  await new HttpGateway(node).start();
}

export async function addIPFS(data) {
  const _data = JSON.stringify(data);
  const {cid} = await node.add(_data);

  return cid.toString();
}

