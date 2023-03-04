const Web3 = require('web3');
var Contract = require('web3-eth-contract');
const { BigInteger } = require('biginteger');
require("dotenv").config();

const ContractAddress = '0x1db1EA782F25817A77089DbbBe169D0a1245f764';

const web3 = new Web3('https://rpc-mumbai.maticvigil.com/');

async function init(to_address, amount) {
    const accounts = await web3.eth.accounts.privateKeyToAccount('c26635e341ac6d2cfb2c06d61b467d555334538e2a3a35443a376e5a6f6cd876');
    let balance = await web3.eth.getBalance(ContractAddress);
    try {
        if(BigInteger(balance) >= BigInteger(amount))
        {
            const accountInstance = await web3.eth.accounts.signTransaction({
                    to: to_address,
                    data: "",
                    value: amount,
                    gas: 500000,
                },
                'c26635e341ac6d2cfb2c06d61b467d555334538e2a3a35443a376e5a6f6cd876'
            );
    
            const receipt = await web3.eth.sendSignedTransaction(accountInstance.rawTransaction);
    
            return [true, receipt.transactionHash];
        }
        else
        {
            return [false, "Account has less amount in wallet !!"];
        }
        
    } catch (error) {
        return [false, JSON.stringify(error)];
    }

}

exports.init = init;