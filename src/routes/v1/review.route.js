const express = require('express');
const validate = require('../../middlewares/validate');
const reviewValidation = require('../../validations/review.validation');
const reviewController = require('../../controllers/review.controller');

const router = express.Router();

router.get('/', validate(reviewValidation.getReviews), reviewController.getReviews);
router.get('/:reviewId', validate(reviewValidation.getReview), reviewController.getReview);
router.post('/', validate(reviewValidation.createReview), reviewController.createReview);
router.delete('/:reviewId', validate(reviewValidation.deleteReview), reviewController.deleteReview);

module.exports = router;
