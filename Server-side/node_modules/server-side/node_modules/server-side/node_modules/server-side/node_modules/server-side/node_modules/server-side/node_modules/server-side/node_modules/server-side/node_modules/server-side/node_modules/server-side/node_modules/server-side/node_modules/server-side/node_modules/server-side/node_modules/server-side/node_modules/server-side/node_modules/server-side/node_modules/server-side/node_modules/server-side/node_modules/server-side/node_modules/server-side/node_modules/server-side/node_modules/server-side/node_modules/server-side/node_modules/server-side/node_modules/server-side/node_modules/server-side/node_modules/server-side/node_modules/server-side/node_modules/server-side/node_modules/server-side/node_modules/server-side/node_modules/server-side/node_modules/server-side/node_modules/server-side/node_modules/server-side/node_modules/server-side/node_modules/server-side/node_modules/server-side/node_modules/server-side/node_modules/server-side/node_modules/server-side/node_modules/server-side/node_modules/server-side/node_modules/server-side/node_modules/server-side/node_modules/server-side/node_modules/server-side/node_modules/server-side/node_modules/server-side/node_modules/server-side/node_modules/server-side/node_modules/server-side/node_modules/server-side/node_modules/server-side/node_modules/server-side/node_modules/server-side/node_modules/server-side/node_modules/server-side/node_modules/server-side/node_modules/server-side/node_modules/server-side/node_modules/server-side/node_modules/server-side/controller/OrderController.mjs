import Order from '../model/OrderSchema.mjs';
import CustomerSchema from '../model/CustomerSchema.mjs';
import ProductSchema from '../model/ProductSchema.mjs';
import mongoose from 'mongoose';
import fs from 'fs';
import nodemailer from 'nodemailer';
import { createInvoice } from '../util/invoice.mjs'; 

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nilankashehan679@gmail.com',
        pass: 'gxob veqb zhmq jmvo', // Replace with your app password
    },
});

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
      _id: new mongoose.Types.ObjectId(), // Generate an ID for the order
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
    
    // Check if any product updates failed
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
    
    // Generate invoice PDF
    try {
      const pdfPath = await createInvoice(newOrder, null); // Pass null as filePath to use default
      
      const mailOptions = {
        from: "Smart Stock Prime",
        to: newOrder.Customer.email,
        subject: 'Your Bill Invoice',
        text: 'Please find attached your colorful bill invoice.',
        attachments: [{
          filename: `bill_${newOrder._id}.pdf`,
          path: pdfPath
        }]
      };
      
      // Send email
      const emailResult = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', emailResult.response);
      
      // Delete temporary PDF after sending
      fs.unlinkSync(pdfPath);
    } catch (error) {
      console.error('Invoice generation or email sending failed:', error);
      // Continue the function even if email sending fails - the order was still saved
    }
    
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

        const updatedOrder = await Order.findByIdAndUpdate(id,{status},{new:true,});
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
        const selectedOrder = await Order.find({user:req.params.id});
        const total = await Order.find({user:req.params.id}).countDocuments();
        if(selectedOrder){
            return resp.status(200).json({message:"Orders found!",data:{dataList:selectedOrder,count:total}});
        }
        resp.status(404).json({message:"Orders not found!"});
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
        const orders = await Order.find({"Customer._id":customerId}).sort({ Date: -1 });
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
const staffPerformance = async(req,resp)=>{
    try {
        const pipeline = [
            {
                $lookup: {
                    from: 'users', // Name of the users collection
                    localField: 'user', // Field in the orders collection
                    foreignField: '_id', // Field in the users collection
                    as: 'userDetails' // Output array name
                }
            },
            // {
            //     $unwind: '$userDetails' // Unwind the userDetails array
            // },
            {
                $group: {
                    _id: '$user', // Group by user ID
                    orderCount: { $sum: 1 }, // Count number of orders per user
                    totalSales: { $sum: '$total' }, // Sum total sales amounts
                    ordersCompleted: { $push: '$_id' }, // Track order IDs
                    email: { $first: '$userDetails.email' }, // Get email from looked-up user
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    orderCount: 1,
                    totalSales: 1,
                    totalOrdersCompleted: { $size: '$ordersCompleted' }
                }
            },
            {
                $sort: { orderCount: -1 } // Sort by order count in descending order
            }
        ];
    
        const staffPerformance = await Order.aggregate(pipeline);
        resp.status(200).json(staffPerformance);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: 'Error fetching staff Performance' });
    }
}
const frequentCustomers = async(req, resp) => {
    try {
        const pipeline = [
            {
                $group: {
                    _id: '$Customer._id', // Fixed: Remove the asterisk
                    orderCount: { $sum: 1 }, // Count number of orders per user
                    totalCustomerSales: { $sum: '$total' }, // Sum total sales amounts
                    customerInfo: { $first: '$Customer' } // Optional: Keep customer details
                }
            },
            {
                $project: {
                    _id: 1,
                    orderCount: 1,
                    totalCustomerSales: 1,
                    customerInfo: 1
                }
            },
            {
                $sort: { orderCount: -1 } // Sort by order count in descending order
            }
        ];
    
        const frequentCustomersData = await Order.aggregate(pipeline);
        console.log(frequentCustomersData);
        resp.status(200).json(frequentCustomersData);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: 'Error fetching frequent customers data' });
    }
}

const findIncomeByCurrentMonth = async (req, resp) => { // admin, manager
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        
        const data = await Order.find({
            Date: { $gte: startOfMonth, $lt: endOfMonth },
        });
        
        const incomeByDay = data.reduce((acc, payment) => {
            let day;
            
            if (payment.Date.$date) {
                // Handle the case where Date is stored as { $date: "..." }
                day = new Date(payment.Date.$date).toISOString().split("T")[0];
            } else {
                // Handle the case where Date is already a Date object
                day = payment.Date.toISOString().split("T")[0];
            }
            
            acc[day] = (acc[day] || 0) + payment.total;
            return acc;
        }, {});
        
        resp.status(200).json({
            message: "month income", 
            data: {
                month: now.getMonth() + 1,
                income: incomeByDay
            }
        });
    } catch (e) {
        resp.status(500).json({error: e.message});
    }
}

const findIncomeByCurrentDay = async (req, resp) => { // admin, manager
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        // Convert string ID to ObjectId if using MongoDB's ObjectId
        const userId = req.params.id;
        const data = await Order.find({
            "user": userId,  // Match the correct field structure
            Date: startOfDay.toISOString().split("T")[0],
        });

        // Calculate total income for the day
        const totalIncome = data.reduce((total, order) => {
            return total + order.total;
        }, 0);
        
        resp.status(200).json({
            message: "daily income", 
            data: {
                date: startOfDay.toISOString().split("T")[0],
                income: totalIncome,
                orderCount: data.length
            }
        });
    } catch (e) {
        resp.status(500).json({error: e.message});
    }
}
const findOrdersByCurrentDay = async(req, resp)=>{
    try{
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const {page=1, size=10}= req.query;
        const userId = req.params.id;
        //const orderList = await Order.find().sort({Date:-1}).skip((page-1)* size).limit(parseInt(size));
        const orderList = await Order.find(
            {
                "user": userId,  // Match the correct field structure
                Date: startOfDay.toISOString().split("T")[0],
            }
        ).skip((page-1)* size).limit(parseInt(size));
        resp.status(200).json({
            message: "Today Orders", 
            data:orderList
        });
        //,data:{dataList:orderList,count:total
    }catch(e){
        resp.status(500).json({error: e.message});
    }
}
const productLifeCycle = async(req, resp) => {
    try {
        const { productId } = req.params; // Assuming you're passing product ID as a URL parameter
        
        // Aggregate pipeline to calculate product quantities per date
        const pipeline = [
          {
            $unwind: '$products' // Unwind the array of products in each order
          },
          {
            $match: {
              'products.id': productId // Filter for the specific product
            }
          },
          {
            $group: {
                _id: {
                  date: { $dateToString: { format: "%Y-%m-%d", date: "$Date" } },
                  productId: '$products.id'
                },
                quantitySold: { $sum: '$products.qty' } // Sum quantities
            }
          },
          {
            $project: {
              _id: 0,
              date: '$_id.date',
              //productId: '$_id.productId',
              quantitySold: 1
            }
          },
          {
            $sort: { date: 1 } // Sort by date ascending
          }
        ];
    
        const productSales = await Order.aggregate(pipeline);
        resp.status(200).json(productSales);
    } catch (error) {
        console.error(error);
        resp.status(500).json({ message: 'Error fetching product sales data' });
    }
};
export {
    saveOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    findOrder,
    loadAllOrders,
    ordersByCustomer,
    findIncomeByCurrentMonth,
    findIncomeByCurrentYear,
    topSellingProduct,
    staffPerformance,
    frequentCustomers,
    findIncomeByCurrentDay,
    findOrdersByCurrentDay,
    productLifeCycle
};