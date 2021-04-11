const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product must have a name'],
        trim: true,
        minLength: [2, 'A product name must have at least 2 characters']
    },
    description: {
        type: Array,
        required: true        
    },
    coverImage: {
        type: String,
        default: "default-store-350x350.jpg"
    },
    images: {
        type: Array
    },
    quantity: {
        type: Number,
        required: [true, 'A product must have a quantity specified']
    },
    oldPrice: Number,
    currentPrice: Number,
    price: {
        type: Number,
        required: [true, 'A product must have a price']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Product must belong to a user!']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }

},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true});
    this.currentPrice = this.price;
    this.coverImage = this.images[0];
    next();
});

productSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: '-__v -passwordChangedAt'
    });
  
    next();
  });


const Product = mongoose.model('Product', productSchema)

module.exports = Product;