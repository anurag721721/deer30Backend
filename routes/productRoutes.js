const express=require('express');
const { getAllProduct, createProduct, getLatestProduct ,getProductDetailsbyId} = require('../controllers/productController');
const router = express.Router();

router.post('/create-product', createProduct);
router.get('/get-all-product', getAllProduct);
router.get('/get-latest-product', getLatestProduct);
router.get('/get-product-details/:id', getProductDetailsbyId);


module.exports = router;


