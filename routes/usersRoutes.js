const express=require('express')
const {userSignUp,userLogin, userVerify}=require('../controllers/userController')
const router = express.Router();

router.post('/signup', userSignUp);
router.post('/login', userLogin);
router.post('/userVerify', userVerify);

module.exports = router;


