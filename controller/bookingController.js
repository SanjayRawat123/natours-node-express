const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory')
const AppError = require('../utils/appError');

exports.getCheckoutSession= catchAsync(async(req,res,next)=>{
    //1)Get Currently booked tour
     const tour = await Tour.findById(req.params.tourId);

    //2) checkout session

    //3) create session as response
})