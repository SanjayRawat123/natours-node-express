const express = require('express');
const tourController = require('../controller/tour-controller');
const authController = require('../controller/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

// router.param('id', tourController.checkID);
// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews

router.use('/:tourId/reviews', reviewRouter);

router
    .route('/top-5-cheap').get(tourController.aliasTopTour, tourController.getAllTours);

router
    .route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router
    .route('/tours-within/:distance/center/:latlng/unit/:unit')
    .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);
router
    .route('/:id')
    .delete(authController.isLoggedIn,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.deleteTour)
    .get(authController.protect, tourController.getTourById)
    .patch(authController.protect,
        authController.restrictTo('admin', 'lead-guide'),
        tourController.uploadTourImages,
        tourController.resizeTourImages,
        tourController.updateTour);




// // POST /tour/234fad4/reviews
// // GET /tour/234fad4/reviews

// router
// .route('/:tourId/reviews')
// .post(authController.protect, authController.restrictTo('user'),
//     reviewController.createReview);

module.exports = router;