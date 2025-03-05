import express from"express";
import * as productController from "../controller/ProductController.mjs";

const router = express.Router();

router.post('/create', productController.create);
router.put('/update/:id',productController.updateProduct);
router.get('/find-all', productController.loadAllProduct);
router.delete('/delete/:id', productController.deleteById);
router.get('/expiring-soon', productController.expSoonProduct);
router.get('/find-by/:id',productController.findById);
router.get('/invetory-value',productController.invetoryValue);

export default router;