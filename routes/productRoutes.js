const express=require('express');
const { getAllProduct, createProduct } = require('../controllers/productController');
const router = express.Router();

router.post('/create-product', createProduct);
router.get('/get-all-product', getAllProduct);


module.exports = router;


