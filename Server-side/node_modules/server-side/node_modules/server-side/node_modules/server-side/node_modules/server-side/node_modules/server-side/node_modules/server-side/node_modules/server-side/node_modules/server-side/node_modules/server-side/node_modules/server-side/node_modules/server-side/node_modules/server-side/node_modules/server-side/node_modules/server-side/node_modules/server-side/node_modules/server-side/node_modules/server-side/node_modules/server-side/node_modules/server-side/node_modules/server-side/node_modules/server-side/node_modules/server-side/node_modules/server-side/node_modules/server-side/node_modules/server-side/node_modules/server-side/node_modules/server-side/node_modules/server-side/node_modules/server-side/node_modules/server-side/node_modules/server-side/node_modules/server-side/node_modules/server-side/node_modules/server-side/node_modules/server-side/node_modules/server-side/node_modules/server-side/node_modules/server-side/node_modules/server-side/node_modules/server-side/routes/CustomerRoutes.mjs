import express from"express";
import { saveCustomer, updateCustomer, loadAllCustomers, findById, deleteCustomer } from "../controller/CustomerController.mjs";
const router = express.Router();

router.post('/create', saveCustomer);
router.put('/update/:id', updateCustomer);
router.get('/find-all', loadAllCustomers);
router.get('/find-by-id/:id', findById);
router.delete('/delete/:id', deleteCustomer);

export default router;

//http://localhost:3000/api/v1/customers/create
//http://localhost:3000/api/v1/customers/update/:id
//http://localhost:3000/api/v1/customers/find-all
//http://localhost:3000/api/v1/customers/delete