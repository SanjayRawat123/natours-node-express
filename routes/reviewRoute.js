const express = require('express');
// const tourController = require('../controller/tour-controller');
const authController = require('../controller/authController');
const reviewController = require('../controller/reviewController')

const router = express.Router({ mergeParams: true });


router.use(authController.protect);
// POST /tour/234fad4/reviews
// POST /reviews

router
    .route('/')
    .get(reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router.route('/:id')
    .delete(authController.restrictTo('user', 'admin'), reviewController.deleteReview)
    .patch(authController.restrictTo('user', 'admin'), reviewController.updateReview)
    .get(reviewController.getReview);
module.exports = router;