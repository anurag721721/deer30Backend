const express=require("express")
const userAuthRoutes=require('./routes/usersRoutes')
const productRoutes=require('./routes/productRoutes')
const router=express.Router()

router.use('/user',userAuthRoutes)
router.use('/product',productRoutes)

module.exports = router;



