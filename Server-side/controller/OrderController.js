const Order = require('../model/OrderSchema');
const CustomerSchema = require('../model/CustomerSchema');
const ProductSchema = require('../model/ProductSchema');
const mongoose = require('mongoose');

const saveOrder = async (req, resp) => {
  try {
    // 1. Validate Order Data (Optional but recommended)
    // You can implement data validation using libraries like Joi or Ajv

    // 2. Extract Customer ObjectId (if applicable)
    if (req.body.Customer) {
      try {
        new mongoose.Types.ObjectId(req.body.Customer._id);
      } catch (error) {
        return resp.status(400).json({ message: "Invalid Customer ID format" });
      }
    }
    // 3. Create New Order Object
    const newOrder = {
      products: req.body.products,
      total: req.body.total,
      status: req.body.status,
      user: req.body.user,
      Customer: req.body.Customer,
      date: new Date().toISOString().slice(0, 10),
    };

    // 4. Update Product Quantities (without transactions)
    const productUpdates = [];
    for (const product of req.body.products) {
      productUpdates.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { quantity: -product.qty } },
          upsert: false, // Don't create a new product if it doesn't exist
        },
      });
    }

    // Execute bulk updates outside a transaction (since transactions might not be supported)
    const productUpdateResults = await ProductSchema.bulkWrite(productUpdates);

    // Check if any product updates failed (assuming the first index corresponds to the first product)
    if (productUpdateResults.modifiedCount !== req.body.products.length) {
      console.error(
        "Error updating product quantities:",
        productUpdateResults.writeErrors
      );
      return resp.status(500).json({ message: "Failed to update product quantities" });
    }

    // 5. Save the Order (without transactions)
    const createdOrder = new Order(newOrder);
    const savedOrder = await createdOrder.save();

    resp.status(201).json({ message: "Order saved", data: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error.message);
    resp.status(500).json({ message: "Failed to save order" });
  }
};

const updateOrder = async (req,resp)=>{ // admin
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new:true,
                    }
                );
                if(updatedOrder){
                    return resp.status(201).json({message:"order updated",data:updatedOrder});
                }
                resp.status(404).json({message:"Order not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}

const updateOrderStatus = async (req,resp)=>{ // admin
    try{
        const {id} = req.params;
        const {status}= req.body;

        if(!["PENDING","REJECTED","COMPLETED","CANCELLED"].includes(status)){
            return resp.status(400).json({message:"invalid status",data:null});
        }

        const updatedOrder = await Order.findByIdAndUpdate(
                    id,{status},{new:true,}
                );
                if(updatedOrder){
                    return resp.status(201).json({message:"order updated",data:updatedOrder});
                }
                resp.status(404).json({message:"Order not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const deleteOrder = async (req,resp)=>{// admin
    try{
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if(deletedOrder){
            return resp.status(200).json({message:"Order deleted",data:deletedOrder});
        }
        resp.status(404).json({message:"Order not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const findOrder = async (req,resp)=>{// admin, manager
    try{
        const selectedOrder = await Order.findById(req.params.id);
        if(selectedOrder){
            return resp.status(200).json({message:"Order found!",data:selectedOrder});
        }
        resp.status(404).json({message:"Order not found!"});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const loadAllOrders = async (req,resp)=>{// admin, manager
    try{
        const {page=1, size=10}= req.query;
        //const orderList = await Order.find().sort({Date:-1}).skip((page-1)* size).limit(parseInt(size));
        const orderList = await Order.find().skip((page-1)* size).limit(parseInt(size));
        const total = await Order.countDocuments();
        resp.status(200).json({message:"data list",data:{dataList:orderList,count:total}})
    }catch(e){
        resp.status(500).json({error:e.message})
    }
}
const ordersByCustomer = async (req,resp)=>{
    try {
        const customerId = req.params.id;
        const user = await CustomerSchema.findOne({ _id: customerId });

        if (!user) {
            return resp.status(404).json({ message: "No Customer found with this id" });
        }
        const orders = await Order.find({"Customer._id":customerId});
        const total = await Order.find({"Customer._id":customerId}).countDocuments();
        if (!orders) {
            return resp.status(404).json({ message: "No order found for this Customer", });
        }
        resp.status(200).json({message:"data list",data:{dataList:orders,count:total}});
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: "Internal Server Error" });
    }
}
const findIncomeByCurrentMonth = async (req,resp)=>{ // admin, manager
    try{
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        const data = await Order.find({
            Date: { $gte: startOfMonth, $lt: endOfMonth },
        });

        const incomebyDay  = data.reduce((acc, payment)=>{
            const day = payment.Date.toISOString().split("T")[0];// [date,time]
            acc[day] = (acc[day] || 0) + payment.total;
            return acc;
        },{});
        resp.status(200).json({message:"month income",data:{month:now.getMonth()+1,income:incomebyDay}});
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}
const findIncomeByCurrentYear = async (req,resp)=>{ // admin, manager
    try{
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1);      // Start of year (Jan 1st)
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1);    // Start of next year (Jan 1st)

        const data = await Order.find({
            Date: { $gte: startOfYear, $lt: endOfYear },
        });

        const incomebyDay  = data.reduce((acc, payment)=>{
            const month = payment.Date.getMonth();      // Get month index (0-based)
            acc[month] = (acc[month] || 0) + payment.total;
            return acc;
        },{});
        resp.status(200).json({ message: "year income", data: { year: now.getFullYear(), income: incomebyDay } });
    }catch(e){
        resp.status(500).json({error:e.message});
    }
}

const topSellingProduct = async(req,resp) =>{
    try {
        // Aggregate pipeline to calculate product quantities
        const pipeline = [
          {
            $unwind: '$products' // Unwind the array of products in each order
          },
          {
            $group: {
                _id: '$products._id', // Group by product ID
                id: { $first: '$products.id' }, 
                productName: { $first: '$products.name' },
                //productName: '$products.name', // Include 'name' for projection
                quantitySold: { $sum: '$products.qty' } // Sum quantities
            }
          },
          {
            $project: {
              _id: 0, // Exclude unnecessary field from the output
              productId: '$id',
              productName: 1,
              quantitySold: 1
            }
          },
          {
            $sort: { quantitySold: -1 } // Sort by quantity sold in descending order
          },
          {
            $limit: 5 // Limit to top 5 products (adjusted from 10)
          }
        ];
    
        const topSellingProducts = await Order.aggregate(pipeline);
        console.log(topSellingProduct);
        resp.status(200).json(topSellingProducts);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: 'Error fetching top selling products' });
    }
}

module.exports={
    saveOrder,updateOrder,updateOrderStatus,deleteOrder,findOrder,loadAllOrders,ordersByCustomer,findIncomeByCurrentMonth,findIncomeByCurrentYear,topSellingProduct
};