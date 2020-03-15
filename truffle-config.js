const path = require("path");
const HDWalletPtovider = require("@truffle/hdwallet-provider");
require("dotenv").config({
  path: "./.env"
})
const Memonic = process.env.MEMONIC
console.log(Memonic)
const AccountIndex = 0;
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      port: 7545,
      host: "127.0.0.1",
      network_id: 5777
    },
    ganache_local: {
      provider: function () {
        return new HDWalletPtovider(Memonic, "http://127.0.0.1:7545", AccountIndex)
      },
      network_id: 5777

    },
    goerli_infura: {
      provider: function () {
        return new HDWalletPtovider(Memonic, "https://goerli.infura.io/v3/8a868cb6545e4c668e973f982bf52e0f", AccountIndex)
      },
      network_id: 5

    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletPtovider(Memonic, "https://ropsten.infura.io/v3/8a868cb6545e4c668e973f982bf52e0f", AccountIndex)
      },
      network_id: 3

    }
  },

  compilers: {
    solc: {
      version: "0.6.1"
    }
  }
};
