import express from "express";
import * as OrderController from '../controller/OrderController.mjs';

const router = express.Router();

router.post('/create', OrderController.saveOrder);
router.put('/update/:id', OrderController.updateOrder);
router.put('/update-status/:id', OrderController.updateOrderStatus);
router.delete('/delete/:id', OrderController.deleteOrder);
router.get('/find-customer/:id', OrderController.ordersByCustomer);
router.get('/find/:id', OrderController.findOrder);
router.get('/find-all', OrderController.loadAllOrders);
router.get('/income-by-month', OrderController.findIncomeByCurrentMonth);
router.get('/income-by-year', OrderController.findIncomeByCurrentYear);
router.get('/income-by-user-by-date/:id', OrderController.findIncomeByCurrentDay);
router.get('/top-selling', OrderController.topSellingProduct);
router.get('/staff-performance', OrderController.staffPerformance);
router.get('/frequent-customers', OrderController.frequentCustomers);
router.get('/orders-by-currentDay/:id', OrderController.findOrdersByCurrentDay);
router.get('/product-sell-By-date/:productId', OrderController.productLifeCycle);
export default router;
//http://localhost:3000/api/v1/orders/create
//http://localhost:3000/api/v1/orders/
//http://localhost:3000/api/v1/orders/find-all
//http://localhost:3000/api/v1/orders/orders-find-customer/6776551b4e517d4656918408
//http://localhost:3000/api/v1/orders/income-by-user-by-date/6776551b4e517d4656918408
//http://localhost:3000/api/v1/orders/income-by-month
//http://localhost:3000/api/v1/orders/income-by-months
//http://localhost:3000/api/v1/orders/staff-performance
//http://localhost:3000/api/v1/orders/frequent-customers
//http://localhost:3000/api/v1/orders/orders-by-currentDay
//findOrdersByCurrentDay