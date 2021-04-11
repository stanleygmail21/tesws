const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/bookingModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');


exports.getAllBookings = handlerFactory.getAll(Booking);
exports.createBooking = handlerFactory.createOne(Booking);
exports.getBooking = handlerFactory.getOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);
exports.deleteBooking = handlerFactory.deleteOne(Booking);

exports.setUserIds = (req, res, next) => {
    // Allow nested routes
    if (!req.body.user) req.body.user = req.user.id;
    next();
  };


exports.chargeCard = catchAsync(async (req, res, next) => {
    const {payment_id, checkoutTotal, user } = req.body;
    const { productId } = req.params;
    if(!payment_id) return next();

    const paymentIntent = await stripe.paymentIntents.create({
        amount: checkoutTotal * 100,
        currency: 'usd',
        payment_method_types: ['card'],
      });

      const confirmPaymentIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {payment_method: payment_id}
      );

      const booking = await Booking.create({
          product: productId,
          user,
          price: checkoutTotal,
          paid: true
      });

    res.status(200).json({
        status: 'success',
        data: {
            data: booking
        }
    })
})