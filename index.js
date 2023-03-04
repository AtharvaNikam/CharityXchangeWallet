const express = require('express');
require("dotenv").config();
const bodyParser = require('body-parser');
const cors = require('cors');
const {success, failed} = require('./helper.js');
const { paymentValidation } = require('./validation.js');
const { validationResult, body } = require('express-validator');
const { init } = require('./crypto.js');
const { BigInteger } = require('biginteger');
const fileUpload = require('express-fileupload');
var XLSX = require("xlsx");
const { TronUSDTInit } = require('./tron.js');
const { connectToMongo } = require("./db/Connection.js");
const { Transaction } = require('./model/transactionSchema.js');
const { User } = require('./model/userSchema.js');
const { hash, compare } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/auth.js');

let port = process.env.PORT;
let host = process.env.HOST;

const app = express()

app.use(express.json());
 
app.use(bodyParser.json());
 
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

app.use(fileUpload());

app.use(express.static(__dirname + '/public'));

connectToMongo();

app.post('/create-admin', async (req, res) => {
    try{

        const checkExisting = await User.findOne({ email: req.body.email });

        if (checkExisting) {
            res.status(422).send(failed('User exists already'));
            return;
        }
        
        $userData = {
            'firstName': req.body.firstName,
            'lastName': req.body.lastName,
            'email': req.body.email,
            'password': await hash(req.body.password, 12),
            'createdAt': Date.now(),
            'updatedAt': Date.now() 
        };

        const user = await User.create($userData)

        if(user)
        {
            res.send(success("User created successfully", user));
        }
        else
        {
            res.status(400).send(failed("Something Went Wrong !"));
        }
    }
    catch(error)
    {
        res.status(400).send(failed("Something Went Wrong !", error));
    }

});

app.post('/token', async (req, res) => {
    const result = await User.findOne({ email: req.body.email });

    if (!result) {
        res.status(422).send(failed('User Not Found'));
        return;
    }

    const checkPassword = await compare(req.body.password, result.password);

    if (!checkPassword) {
        res.status(404).send(failed('Incorrect Password'))
    }
    else
    {
        const token = await jwt.sign({
            id: Date.now(),
            email: req.body.email,
            password: result.password
        }, 'SOsLhzYl5lOA2LxOcsLxSmGJWKYTCxIBiqePOQaW6q');

        res.status(200).send(success('Login Successfully', token))
    }


})

app.post('/transfer-test', verifyToken, async (req, res) => {
    const res1 = await TronUSDTInit('TZ4MMkU8JhFnpsVLJUMiwSsc9a2mPQPmSt', 1*1000000);
    res.send(success('Transfer Completed !!', req.user));
    
});

app.post('/transfer', verifyToken, paymentValidation, async (req, res) => {
    let file = req.files.file;
    let uploadPath = __dirname + '/public/uploads/'+new Date().getTime()+"-" +file.name;
    await file.mv(uploadPath);

    let workbook = XLSX.readFile(uploadPath);
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
    const validator = validationResult(req);
 
    if (!validator.isEmpty()) {
        res.status(400).send(failed("Validation Error",validator))
    }
    else
    {
        let transactionResults = [];
        for (const item of xlData) {
            // const res1 = await init(item.Address, BigInteger.parse(item.Amount*1000000000000000000).toString());
            const res1 = await TronUSDTInit(item.Address, item.Amount*1000000);
            if(res1)
            {
                transactionResults = [...transactionResults, {
                    name: item.Name,
                    walletAddress: item.Address,
                    amount: item.Amount,
                    status: res1[0] ? 1 : 0,
                    remarks: res1[1],
                    createdAt: Date.now()
                }];
            }
        }
        

        const transactions = await Transaction.insertMany(transactionResults);
        if(transactions.length > 0)
        {
            res.send(success('Transfer Completed !!', transactions));
        }
        else
        {
            res.send(success('Transfer Completed !!'));
        }
    }
})

app.post('/transaction-history', verifyToken, async function (req, res) {
    try {
        const transaction = await Transaction.find({}).sort({createdAt: 'desc'});
        res.send(success('Transaction List', transaction));
      } catch (error) {
        res.status(404).send(failed('Something went wrong', error));
      }
})

app.get('/', async(req, res) => {
    res.send("Welcome To Crypto Distributor !!");
});

// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});

app.listen(port, () => {
    console.log(`Listening at ${host}:${port}`)
});