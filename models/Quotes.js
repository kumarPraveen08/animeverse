const mongoose = require("mongoose");

const QuoteSchema = new mongoose.Schema(
  {
    anime: {
      type: String,
      required: [true, "Please add anime name"],
      trim: true,
    },
    character: {
      type: String,
      required: [true, "Please add character name"],
      trim: true,
    },
    quote: {
      type: String,
      required: [true, "Please add quote"],
      trim: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: [true, "Please add quote"],
    },
  }
  // {
  //   timestamps: true,
  // }
);

module.exports = mongoose.model("Quote", QuoteSchema);
