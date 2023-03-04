const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({ 
    name:{
        type: String,
        required :true
    },
    walletAddress:{
        type: String,
        required :true
    },
    amount:{
        type: String,
        required :true
    },
    status:{
        type: Boolean,
        default: false
    },
    remarks: {
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        dafault: Date.now
    }
})

const Transaction = mongoose.model('transactions',TransactionSchema);
exports.Transaction = Transaction