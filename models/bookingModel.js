const mongoose = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const bookingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Booking must have a product!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  },
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  });

bookingSchema.pre(/^find/, function(next){
  this.populate('user').populate({
    path: 'product',
    select: 'name'
  });

  next()
});

bookingSchema.pre('save', async function(next){
  const product = await Product.findById(this.product);
  const lender = await User.findById(product.user);
  lender.wallet += this.price;
  await lender.save({
    validateBeforeSave: false
  });

  next()
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
