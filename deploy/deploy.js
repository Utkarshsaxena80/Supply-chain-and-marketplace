const {network,getNamedAccounts,deployments}= require("hardhat");
//  const { TASK_NODE_SERVER_READY } = require("hardhat/builtin-tasks/task-names");
const { networkConfig, developmentChains } = require("../helper-hardhat-config.js");
module.exports=async ()=>{
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();
    const chainId=network.config.chainId;
const fee= ethers.parseUnits("0.01",18);
    log(`Network: ${network.name} (Chain ID: ${chainId})`);
    log(`Deployer: ${deployer}`);
     
    try{
        const uploadContract=await deploy("supplyChain",{
            from :deployer,
            args:[fee],//constructor
            log:true,
            waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
        });

        log(` Contract deployed to: ${uploadContract.address}`);
        log("=================================================\n");
    }catch(error){
        console.error("\n❌ Deployment Failed!");
    console.error(error);
    process.exit(1);
    }

    
}
module.exports.tags = ["supply"];