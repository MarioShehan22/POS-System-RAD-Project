const express = require('express');
const router = express.Router();
const OrderController= require('../controller/OrderController');

router.post('/create', OrderController.saveOrder);
router.put('/update/:id', OrderController.updateOrder);
router.put('/update-status/:id', OrderController.updateOrderStatus);
router.delete('/delete/:id', OrderController.deleteOrder);
router.get('/find-customer/:id', OrderController.ordersByCustomer);
router.get('/find/:id', OrderController.findOrder);
router.get('/find-all', OrderController.loadAllOrders);
router.get('/income-by-month', OrderController.findIncomeByCurrentMonth);
router.get('/income-by-year', OrderController.findIncomeByCurrentYear);
router.get('/top-selling', OrderController.topSellingProduct);

module.exports = router;
//http://localhost:3000/api/v1/orders/create
//http://localhost:3000/api/v1/orders/
//http://localhost:3000/api/v1/orders/find-all
//http://localhost:3000/api/v1/orders/orders-find-customer/6776551b4e517d4656918408
//http://localhost:3000/api/v1/orders/income-by-months
//http://localhost:3000/api/v1/orders/top-selling