const mongoose = require('mongoose'); // Erase if already required
const { toJSON, paginate } = require('./plugins');
const slugify = require('slugify');

const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        alt: {
          type: String,
        },
      },
    ],
    amenities: [
      {
        name: {
          type: String,
          required: true,
        },
        icon: {
          type: String,
        },
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        rating: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // bookings: [
    //   {
    //     user: {
    //       type: mongoose.Schema.Types.ObjectId,
    //       ref: 'User',
    //     },
    //     // listingId: {
    //     //   type: mongoose.Schema.Types.ObjectId,
    //     //   ref: 'Listing',
    //     // },
    //     checkIn: {
    //       type: Date,
    //       required: true,
    //     },
    //     checkOut: {
    //       type: Date,
    //       required: true,
    //     },
    //   },
    // ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
      },
    ],
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
    },
    bedrooms: {
      type: Number,
      required: true,
    },
    beds: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    instantBook: {
      type: Boolean,
      default: false,
    },
    // availableDates: [
    //   {
    //     date: {
    //       type: Date,
    //       required: true,
    //     },
    //     price: {
    //       type: Number,
    //       required: true,
    //     },
    //   },
    // ],
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
listingSchema.plugin(toJSON);
listingSchema.plugin(paginate);

// Pre-save middleware to generate slug
// listingSchema.pre('save', function (next) {
//   const listing = this;
//   if (!listing.isModified('name')) return next();

//   const slug = slugify(listing.name, {
//     lower: true,
//     strict: true,
//   });
//   listing.slug = slug;
//   next();
// });

//Export the model
module.exports = mongoose.model('Listing', listingSchema);
