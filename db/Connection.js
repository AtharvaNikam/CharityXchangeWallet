const mongoose = require("mongoose");
require("dotenv").config();

const connectToMongo =()=> {
    const mongoURI = process.env.MONGOURI
    

const printportON=()=>{
    return (
        console.log("mongoDB Database is connected")
    )
}
const printportOFF=()=>{
    return (
        console.log("mongoDB Database is NOT connected")
    )
}
const printportERR=()=>{
    return (
        console.log(`there was some Error while connecting to database`,)
    )
}
    mongoose.connect(mongoURI, 
        {
            maxPoolSize:50,
            wtimeoutMS:2500,
            useNewUrlParser:true
        })
    mongoose.connection.on("connected",printportON)
    mongoose.connection.on("disconnected",printportOFF)
    mongoose.connection.on("error",printportERR)
}
exports.connectToMongo = connectToMongo