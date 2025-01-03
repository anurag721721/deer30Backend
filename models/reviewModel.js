const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, 
      max: 5, 
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value for rating.",
      },
    },
    reviewText: {
      type: String,
      trim: true,
    },
    media: [
      {
        type: String, 
      },
    ],
    status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending", // For moderation
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Review", reviewSchema);
