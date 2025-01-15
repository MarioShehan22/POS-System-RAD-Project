const ProductSchema = require('../model/ProductSchema');

const create = async(req,resp)=>{//Admin
    try{
        const createdProduct = new ProductSchema(req.body);
        const savedProduct = await createdProduct.save();
        resp.status(201).json({message:"Product saved",data:savedProduct});
    }catch(error){
        resp.status(500).json({error:error.message});
    }
}
const loadAllProduct = async (req,resp)=>{// admin, manager
    try{
        const {searchText, page=1, size=10}= req.query;
        const filter= searchText?{$or:[
                {productName:{$regex:searchText, $options:"i"}}
            ]}:{};
        const ProductList = await ProductSchema.find(filter).skip((page-1)* size).limit(parseInt(size));
        const total = await ProductSchema.countDocuments(filter);
        resp.status(200).json({message:"data list",data:{dataList:ProductList,count:total}})
    }catch(e){
        resp.status(500).json({error:e.message})
    }
}
const deleteById = async(req,resp) =>{
    try{
        const selectedProduct = await ProductSchema.findById(req.params.id);
        if(selectedProduct){
            const deletedProduct = await ProductSchema.findByIdAndDelete(req.params.id);
            return resp.status(200).json({message:"Product deleted",data:deletedProduct});
        }        
    }catch(e){
        resp.status(500).json({error:e.message})
    }
}
const updateProduct = async (req,resp)=>{// admin,manager
    try{
        const updatedProduct = await ProductSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
            }
        );
        if(updatedProduct){
            return resp.status(201).json({message:"Product updated",data:updatedProduct});
        }
        resp.status(404).json({message:"Product not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
module.exports = {
    create,
    loadAllProduct,
    deleteById,
    updateProduct
}