const express = require("express");
const userController =require("../controller/UserController");
const router = express.Router();

router.post('/register', userController.register);
// router.post('/login', userController.login);
router.get('/find-all', userController.findAll);
router.delete('/delete/:id', userController.deleteById);
//router.put('/update/:id', userController.updateUser);
// router.get('/find-by/:id', userController.FindUserById);
module.exports=router;

// verifyToken,authorize(['Admin','Customer','Manager','Supplier'])