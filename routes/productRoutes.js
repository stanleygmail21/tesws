const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });


router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    productController.setUserIds,
    authController.restrictTo('lender'),
    productController.createProduct
  );

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(
    authController.protect,
    productController.setUserIds,
    productController.updateProduct
  )
  .delete(
    authController.protect,
    productController.deleteProduct
  );

module.exports = router;
