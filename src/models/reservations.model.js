const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reservationSchema = mongoose.Schema(
  {
    guest_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    listing_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Listing',
      required: true,
    },
    check_in: {
      type: String,
      required: true,
      trim: true,
    },
    check_out: {
      type: String,
      required: true,
      trim: true,
    },
    number_of_guests: {
      type: Number,
      required: true,
      trim: true,
    },
    price_per_day: {
      type: Number,
      required: true,
    },
    price_for_stay: {
      type: Number,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      trim: true,
    },
    is_refund: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
    // transaction_id: {
    //   type: mongoose.SchemaTypes.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
    payment_status: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
    cancellation_status: {
      type: Boolean,
      required: true,
      default: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
reservationSchema.plugin(toJSON);
reservationSchema.plugin(paginate);

/**
 * @typedef Reservation
 */
const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
