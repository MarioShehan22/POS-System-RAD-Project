const mongoose = require('mongoose');
const CustomerSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true,
        unique:true,
    },
    phoneNumber:{
        type:String,
        required:true
    },
    activeState:{
        type:Boolean,
        required:true
    }
});
const Customer = mongoose.model('customer', CustomerSchema);
module.exports = Customer;