const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const bookingRouter = require('./bookingRoutes');
const productRouter = require('./productRoutes');

const router = express.Router();

router.use('/:userId/bookings', bookingRouter);
router.use('/:userId/products', productRouter);



// Protect all routes after this middleware
router.use(authController.protect);

router.use('/api/v1/changepassword', authController.protect, authController.updatePassword);
router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
