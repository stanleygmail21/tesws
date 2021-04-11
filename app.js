const path = require('path');
const express = require('express');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const productRouter = require('./routes/productRoutes');
const userRouter = require('./routes/userRoutes');
const meRouter = require('./routes/meRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const authController = require('./controllers/authController');


const app = express();

app.use(cors());
app.options('*', cors());


// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));



// 3) ROUTES

app.use('/api/v1/login', authController.login);
app.use('/api/v1/register', authController.register);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/me', meRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Route not found`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
