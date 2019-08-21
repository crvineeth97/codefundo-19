const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    },
    electioncfd1: {
      network_id: "*",
      gas: 0,
      gasPrice: 0,
      provider: new HDWalletProvider(fs.readFileSync('/home/tyrion/codefundo/HelloBlockchain/mnemonic.env', 'utf-8'), "https://vineeth.blockchain.azure.com:3200/kRGSAbdk9lioVnoWL4LobXFr", 0, 10),
      consortium_id: 1566329424050
    }
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.5.0"
    }
  }
};
