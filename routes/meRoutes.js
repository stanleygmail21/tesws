const express = require('express');
const productController = require('../controllers/productController');
const productRouter = require('./productRoutes');
const bookingRouter = require('./bookingRoutes');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
.route('/')
.get(userController.getMe, userController.getUser)


router.use('/withdraw', userController.withdraw);
router.use('/products', productController.setUserIds,productRouter);
router.use('/bookings', bookingRouter);


module.exports = router;
