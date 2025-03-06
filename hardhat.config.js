const {config:dotEnvConfig}=require("dotenv");
//const { artifacts } = require("hardhat");
dotEnvConfig();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_url=process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_key=process.env.SEPOLIA_PRIVATE_KEY;
module.exports = {
  solidity: "0.8.28",
  defaultNetwork:"hardhat",
  networks:{
    hardhat :{
      chainId:31337,
      blockConfirmations:1,
      cors :true,
    },
    sepolia:{
      chainId:11155111,
      blockConfirmations:6,
      url:SEPOLIA_RPC_url,
      accounts:[SEPOLIA_PRIVATE_key],
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, 
    },
  },
// paths:{
//   artifacts:"../client/src/artifacts"
// }
};