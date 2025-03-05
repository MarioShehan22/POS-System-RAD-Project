import CustomerSchema from'../model/CustomerSchema.mjs';

const saveCustomer = async (req,resp)=>{ // admin, manager
    try{
        const customerId = await generateId();
        const createdCustomer = new CustomerSchema({
            ...req.body,
            id: customerId
        });
        const savedCustomer = await createdCustomer.save();
        resp.status(201).json({message:"customer saved",data:savedCustomer});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const loadAllCustomers = async (req,resp)=>{// admin, manager
    try{
        const {searchText, page=1, size=10}= req.query;
        const filter= searchText?{$or:[
                {customerName:{$regex:searchText, $options:"i"}},
                {address:{$regex:searchText, $options:"i"}},
                {email:{$regex:searchText, $options:"i"}}
            ]}:{};
        const customerList = await CustomerSchema.find(filter).skip((page-1)* size).limit(parseInt(size));
        const total = await CustomerSchema.countDocuments(filter);
        resp.status(200).json({message:"data list",data:{dataList:customerList,count:total}})
    }catch(e){
        resp.status(500).json({error:e.message})
    }
}
const updateCustomer = async (req,resp)=>{// admin,manager
    try{
        const updatedCustomer = await CustomerSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
            }
        );
        if(updatedCustomer){
            return resp.status(201).json({message:"customer updated",data:updatedCustomer});
        }
        resp.status(404).json({message:"customer not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const deleteCustomer = async (req,resp)=>{// admin,manager
    try{
        const deletedCustomer = await CustomerSchema.findByIdAndDelete(req.params.id);
        if(deletedCustomer){
            return resp.status(200).json({message:"customer deleted",data:deletedCustomer});
        }
        resp.status(404).json({message:"customer not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const findById = async (req,resp)=>{
    try{
        const selectedCustomer = await CustomerSchema.findById(req.params.id);
        if(selectedCustomer){
            return resp.status(200).json({message:"customer found!",data:selectedCustomer});
        }
        resp.status(404).json({message:"customer not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const generateId = async () => {
    try {
      const productCount = await CustomerSchema.countDocuments();
      if (productCount === 0) {
        return 'C-1';
      }
      const allProducts = await CustomerSchema.find().select('id').lean();

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
      return `C-${currentId + 1}`;
    } catch (error) {
      console.error('Error generating product ID:', error);
      throw error;
    }
  };
export {
    saveCustomer,
    loadAllCustomers,
    updateCustomer,
    deleteCustomer,
    findById
};