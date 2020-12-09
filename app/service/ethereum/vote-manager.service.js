const Web3 = require('web3');

const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
const ropstenWeb3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/438d6327f07e4d3a9cabac9da72ce178'));
const abi = [
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "votes",
    "outputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fingering",
        "type": "string"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "internalType": "string",
        "name": "ipfsHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "fingering",
        "type": "string"
      }
    ],
    "name": "vote",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "voteId",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_start",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_count",
        "type": "uint256"
      }
    ],
    "name": "getVotes",
    "outputs": [
      {
        "internalType": "string[]",
        "name": "ipfsHashs",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "fingerings",
        "type": "string[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];
const network = 'ropsten';
const myContract = new web3.eth.Contract(abi, '0x686Ea54584ED4debf921bd92993F2Be927f1A18F', {
  from: '0x3E334AA2308BC1e743EC40250eCca7b5430Ae817', // default from address
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

console.log('PrivateKey', process.env.ETHER_PRIVATE_KEY);

const signer = ropstenWeb3.eth.accounts.privateKeyToAccount(
  process.env.ETHER_PRIVATE_KEY
);

ropstenWeb3.eth.accounts.wallet.add(signer);

const ropstenContract = new ropstenWeb3.eth.Contract(abi, process.env.ETHER_SMART_CONTRACT, {
  from: process.env.ETHER_PUBLIC_KEY, // default from address
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

export async function sign(hash, fingering, transactionHash) {
  const tx = ropstenContract.methods.vote(hash, fingering);
  return tx
    .send({
      from: signer.address,
      gas: await tx.estimateGas()
    })
    .once('transactionHash', transactionHash);
}

export async function getVotes(from, count) {
  return ropstenContract.methods.getVotes(from, count).call();
}
