const express=require('express')
const {userSignUp,userLogin, userVerify, forgetPassword, changePassword, verifyOtp}=require('../controllers/userController')
const router = express.Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/userVerify', userVerify);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyOtp/:userId', verifyOtp);
router.post('/resetPassword/:userId', changePassword);

module.exports = router;


