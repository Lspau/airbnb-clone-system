const mongoose = require('mongoose'); // Erase if already required
const { toJSON, paginate } = require('./plugins');
const slugify = require('slugify');
// Declare the Schema of the Mongo model
const listingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: String,
    address: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    house_rules: {
      type: String,
      required: true,
    },
    property_type: {
      type: String,
      required: true,
    },
    room_type: {
      type: String,
      required: true,
    },
    bed_type: {
      type: String,
      required: true,
    },
    minimum_nights: {
      type: Number,
      required: true,
    },
    maximum_nights: {
      type: Number,
      required: true,
    },
    cancellation_policy: {
      type: String,
      enum: ['flexible', 'moderate', 'firm', 'strict'],
    },
    accommodates: {
      type: Number,
    },
    bedrooms: {
      type: Number,
    },
    beds: {
      type: Number,
    },
    images: [],
    price: {
      type: Number,
      required: true,
    },
    security_deposit: {
      type: Number,
    },
    cleaning_fee: {
      type: Number,
    },
    extra_people: {
      type: Number,
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    totalRatings: {
      type: String,
      default: 0,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
listingSchema.plugin(toJSON);
listingSchema.plugin(paginate);

// Pre-save middleware to generate slug
listingSchema.pre('save', function (next) {
  const listing = this;
  if (!listing.isModified('name')) return next();

  const slug = slugify(listing.name, {
    lower: true,
    strict: true,
  });
  listing.slug = slug;
  next();
});

//Export the model
module.exports = mongoose.model('Listing', listingSchema);
