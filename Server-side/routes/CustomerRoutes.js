const express = require("express");
const customerController =require("../controller/CustomerController");

const router = express.Router();

router.post('/create', customerController.saveCustomer);
router.put('/update/:id', customerController.updateCustomer);
router.get('/find-all', customerController.loadAllCustomers);
router.get('/find-by-id/:id', customerController.findById);
router.delete('/delete/:id', customerController.deleteCustomer);
module.exports=router;

//http://localhost:3000/api/v1/customers/create
//http://localhost:3000/api/v1/customers/update/:id
//http://localhost:3000/api/v1/customers/find-all
//http://localhost:3000/api/v1/customers/delete