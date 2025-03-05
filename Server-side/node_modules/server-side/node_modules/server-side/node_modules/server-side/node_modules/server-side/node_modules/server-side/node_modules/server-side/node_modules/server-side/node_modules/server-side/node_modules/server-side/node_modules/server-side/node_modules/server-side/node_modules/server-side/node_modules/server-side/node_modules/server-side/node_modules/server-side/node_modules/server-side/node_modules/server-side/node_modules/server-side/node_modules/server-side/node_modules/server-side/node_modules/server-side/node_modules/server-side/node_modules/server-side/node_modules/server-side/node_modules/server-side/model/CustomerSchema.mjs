import mongoose from'mongoose';
const CustomerSchema= new mongoose.Schema({
    id:{
        type:String,
        unique: true,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
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
export default Customer;