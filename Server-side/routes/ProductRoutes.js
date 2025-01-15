const express = require("express");
const productController =require("../controller/ProductController");

const router = express.Router();

router.post('/create', productController.create);
router.put('/update/:id',productController.updateProduct);
router.get('/find-all', productController.loadAllProduct);
router.delete('/delete/:id', productController.deleteById);
module.exports=router;