const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError')
const tourRouters = require('./routes/tourRoute');
const userRouters = require('./routes/userRoute');
const reviewRouters = require('./routes/reviewRoute');
const bookingRouters = require('./routes/bookingRoute');

const app = express();
app.use(cors());

// 1) GLOBAL MIDDLEWARES
console.log(process.env.NODE_ENV);
// Serving static files
app.use(express.static('./public'));


// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({limit:'10kb'}));
app.use(cookieParser());


// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  // console.log(req.cookies);
  next();
})


// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//3) Routes

app.use('/api/v1/tours', tourRouters);
app.use('/api/v1/users', userRouters);
app.use('/api/v1/reviews',reviewRouters);
app.use('/api/v1/bookings',bookingRouters);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)
module.exports = app;

