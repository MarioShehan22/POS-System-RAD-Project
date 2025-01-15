const mongoose = require('mongoose');
const OrderSchema= new mongoose.Schema({
    products:{
        type:Array,
        required:true
    },
    total:{
        type:Number,
        required:true
    },
    status:{
        type:String, // PENDING, REJECTED, COMPLETED, CANCELLED
        required:true
    },
    Customer:{
        type:Object,
        required:true
    },
    Date:{
        type:Date,
        default: () => {
            const date = new Date();
            date.setHours(0, 0, 0, 0)
            return date.toISOString().slice(0, 10);
        }
    }
});
module.exports = mongoose.model('order',OrderSchema);