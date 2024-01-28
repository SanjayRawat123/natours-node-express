const express = require('express');
const bookingController = require('../controller/bookingController');
const authController = require('../controller/authController')
const router = express.Router();

router.get('/checkout-session',authController.protect,bookingController.getCheckoutSession);


module.exports= router;