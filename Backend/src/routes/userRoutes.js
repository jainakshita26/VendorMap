const express=require('express')
const router=express.Router()
const { registerUser, loginUser,getMe,logout } = require("../controllers/userController");
const {registerValidation ,loginValidation}=require('../validation/user.validator')
const {validate}=require('../middlewares/validation.middleware')
const authMiddleware = require("../middlewares/auth.middleware");


router.post('/register',registerValidation,validate,registerUser);

router.post('/login',loginValidation,validate,loginUser)

router.get('/get-me',authMiddleware,getMe)

router.get('/logout',logout)



module.exports=router;