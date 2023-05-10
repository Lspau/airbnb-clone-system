const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const reservationSchema = new mongoose.Schema(
  {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      // required: true,
    },
    totalPrice: {
      type: Number,
      // required: true,
    },
    // paymentIntent: {},
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'sorted_delete'],
      default: 'pending',
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
    },
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Reservation', reservationSchema);
