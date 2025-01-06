const express=require("express")
const userAuthRoutes=require('./routes/usersRoutes')
const productRoutes=require('./routes/productRoutes')
const userProfileRoutes=require('./routes/userProfileRoutes')
const router=express.Router()

router.use('/user',userAuthRoutes)
router.use('/user/profile',userProfileRoutes)
router.use('/product',productRoutes)

module.exports = router;



