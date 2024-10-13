const express = require('express');
const productController = require('../../controller/product.controller');
const router = express.Router();

router.route('/').post(productController.addProduct);

module.exports = router