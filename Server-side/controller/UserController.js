const userSchema = require('../model/UserSchema');
const jsonwebtoken =require('jsonwebtoken');
const bcrypt = require("bcrypt");
const salt=10;

const register = async (req, resp) => {
    try {
        const result = await userSchema.findOne({ 'email': req.body.email }).maxTimeMS(20000);
        if (!result) {
            const hash = await bcrypt.hash(req.body.password, salt);
            const user = new userSchema({
                email: req.body.email,
                fullName: req.body.fullName,
                role:req.body.role,
                password: hash,
                activeState: req.body.activeState
            });
            await user.save();
            return resp.status(201).json({ 'message': 'Saved!' });
        } else {
            return resp.status(409).json({ 'error': 'already exists!' });
        }
    } catch (error) {
        console.error(error);
        return resp.status(500).json({ 'error': error });
    }
};

const findAll = async (req, res) => {
    try {
        const user = await userSchema.find();
        res.status(200).json(user);
    }catch (error){
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
const deleteById=async (req,resp)=>{
    const deleteData = await userSchema.findByIdAndDelete({'_id':req.params.id});
    if(deleteData){
        return  resp.status(204).json({'message':'deleted'});
    }else{
        return resp.status(500).json({'message':'internal server error'});
    }
}

const login = (req, resp) => {
    console.log(req.body);
    userSchema.findOne({'email':req.body.email}).then(selectedUser=>{
        if (selectedUser!==null){
            bcrypt.compare(req.body.password, selectedUser.password, function(err, result) {
                if (err){
                    return resp.status(500).json({'message':'internal server error'});
                }
                if(result){
                    const payload={
                        email:selectedUser.email,
                        fullName:selectedUser.fullName,
                        role:selectedUser.role
                    }
                    const secretKey=process.env.SECRET_KEY;
                    const expiresIn='2h';
                    if (!secretKey) {
                        return resp.status(500).json({ 'error': 'Missing secret key' });
                    }
                    const token = jsonwebtoken.sign(payload, secretKey, { expiresIn });

                    return resp.status(200).json(token);
                }else{
                    return resp.status(401).json({'message':'Password is incorrect!'});
                }
            });
        }else{
            return resp.status(404).json({'message':'not found!'});
        }
    });
}
module.exports= {
    register,
    findAll,
    deleteById,
    login
}