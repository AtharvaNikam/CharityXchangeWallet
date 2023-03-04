const TronWeb = require('tronweb')
require("dotenv").config();

const USDTContract = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
// const USDTContract = "TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs";

async function TronTRXInit(to_address, amount) {
  try {
    const tronWeb = new TronWeb({
      fullHost: process.env.TRON_API_DOMAIN,
      headers: { "TRON-PRO-API-KEY": process.env.TRON_API_PRIVATE_KEY },
      privateKey: process.env.TRON_WALLET_PRIVATE_KEY
    })

    let balance = await tronWeb.trx.getBalance();

    if(balance >= amount){
      let response = await tronWeb.trx.sendTransaction(to_address, amount,process.env.TRON_WALLET_PRIVATE_KEY);
      if(response.result)
      {
        return [true, response.transaction.txID];
      }
      else
      {
        return [false, JSON.stringify(response)]
      }
    }
    else
    {
      return [false, "Account has less amount in wallet !!"];
    }
    
        
  } catch (error) {
      return [false, JSON.stringify(error)];
  }

}

async function TronUSDTInit(to_address, amount) {
  try {
    const tronWeb = new TronWeb({
      fullHost: process.env.TRON_API_DOMAIN,
      headers: { "TRON-PRO-API-KEY": process.env.TRON_API_PRIVATE_KEY },
      privateKey: process.env.TRON_WALLET_PRIVATE_KEY
    })

    const { abi } = await tronWeb.trx.getContract(USDTContract);
    
    const contract = tronWeb.contract(abi.entrys, USDTContract);
    
    const balance = await contract.balanceOf(process.env.TRON_WALLET_ADDRESS).call();

    console.log("Balance: ", balance.toString());

    if(balance >= amount){
      let response = await contract.transfer(to_address, amount).send();
      if(response)
      {
        return [true, response];
      }
      else
      {
        return [false, JSON.stringify(response)]
      }
    }
    else
    {
      return [false, "Account has less amount in wallet !!"];
    }
    
        
  } catch (error) {
      return [false, JSON.stringify(error)];
  }

}

exports.TronTRXInit = TronTRXInit;
exports.TronUSDTInit = TronUSDTInit;