const ProductSchema = require('../model/ProductSchema');

const create = async(req,resp)=>{//Admin
    try{
        const productId = await generateId();
        // Combine the generated ID with the request body
        const productData = {
            ...req.body,
            id: productId
        };
        
        const createdProduct = new ProductSchema(productData);
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
const findById = async (req,resp)=>{// admin, manager
    try{
        const Product = await ProductSchema.findOne({'_id':req.params.id});
        resp.status(200).json({data: Product})
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
const updateProduct = async (req,resp)=>{// admin
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

const expSoonProduct = async (req,resp)=>{// admin
    try{
        const now = new Date();
        const currentDate = new Date(now); 

        const expirationDate = new Date(currentDate); 
        expirationDate.setDate(currentDate.getDate() + 30); 

        const currentDateString = currentDate.toISOString().split('T')[0];
        const expirationDateString = expirationDate.toISOString().split('T')[0];

        // Find products with an expiration date within the threshold
        const expiringProducts = await ProductSchema.aggregate([
            {
              $match: {
                expDate: { 
                  $gte: currentDateString, 
                  $lte: expirationDateString 
                }
              }
            }
          ]);

        resp.status(200).json(expiringProducts);
    }catch(e){
        resp.status(500).json({ error:e.message });
    }
}

const generateId = async () => {
    try {
      const productCount = await ProductSchema.countDocuments();
      if (productCount === 0) {
        return 'P-1';
      }
      const allProducts = await ProductSchema.find().select('id').lean();

      allProducts.sort((a, b) => {
        const aNum = parseInt(a.id.substring(2));
        const bNum = parseInt(b.id.substring(2));
        return aNum - bNum;
      });
  
      // Get the latest product (which will be the last element after sorting)
      const latestProduct = allProducts[allProducts.length - 1];
  
      // Validate latest product ID format
      if (!latestProduct || !latestProduct.id || !latestProduct.id.includes('-')) {
        // Recover from invalid IDs (optional):
        console.error('Invalid product ID found. Data integrity might be compromised.');
        throw new Error('Data integrity error: Invalid product ID');
      }
  
      //Extract and increment the number
      const currentId = parseInt(latestProduct.id.split('-')[1]);
      if (isNaN(currentId)) {
        throw new Error('Invalid ID format');
      }
      return `P-${currentId + 1}`;
    } catch (error) {
      console.error('Error generating product ID:', error);
      throw error;
    }
  };

module.exports = {
    create,
    loadAllProduct,
    deleteById,
    updateProduct,
    expSoonProduct,
    findById
}