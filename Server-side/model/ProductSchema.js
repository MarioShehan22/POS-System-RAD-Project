const mongoose = require('mongoose');

const ProductSchema= new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    sellingPrice:{
        type:Number,
        required:true,
    },
    showPrice:{
        type:Number,
        required:true
    },
    buyPrice:{
        type:Number,
        required:true
    },
    expDate:{
        type:Date,
        required:true
    },
    activeState:{
        type:Boolean,
        required:true
    }
});

const Product = mongoose.model('product',ProductSchema);
module.exports = Product;