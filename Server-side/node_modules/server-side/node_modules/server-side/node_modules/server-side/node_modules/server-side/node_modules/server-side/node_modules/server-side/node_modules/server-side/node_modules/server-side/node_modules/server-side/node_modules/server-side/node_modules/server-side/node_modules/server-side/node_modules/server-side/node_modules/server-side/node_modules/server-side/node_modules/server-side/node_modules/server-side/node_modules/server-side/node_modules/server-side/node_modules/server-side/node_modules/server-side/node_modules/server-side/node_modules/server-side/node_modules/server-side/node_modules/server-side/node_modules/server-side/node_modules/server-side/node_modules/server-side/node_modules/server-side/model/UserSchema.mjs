import mongoose from'mongoose';
const UserSchema= new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type: String,
        required:true,
        enum: ['Admin','Staff']
    },
    activeState:{
        type:Boolean,
        required:true
    }
});
const User = mongoose.model('user', UserSchema);
export default User;