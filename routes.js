const express=require("express")
const userAuthRoutes=require('./routes/usersRoutes')
const router=express.Router()

router.use('/user',userAuthRoutes)

module.exports = router;



