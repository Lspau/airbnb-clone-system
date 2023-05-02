const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Review } = require('../models');

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReviews = async (filter, options) => {
  const reviews = await Review.paginate(filter, options);
  return reviews;
};

/**
 * Get review by id
 * @param {Object} id - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const getReviewById = async (id) => {
  return Review.findById(id);
};

/**
 * Create a review
 * @param {Object} reviewBody
 * @returns {Promise<User>}
 */
const createReview = async (reviewBody) => {
  return Review.create(reviewBody);
};

/**
 * Delete review by id
 * @param {ObjectId} reviewId
 * @returns {Promise<User>}
 */
const deleteReviewById = async (reviewId) => {
  const review = await getReviewById(reviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Review not found');
  }
  await review.remove();
  return review;
};

module.exports = {
  queryReviews,
  getReviewById,
  createReview,
  deleteReviewById,
};
