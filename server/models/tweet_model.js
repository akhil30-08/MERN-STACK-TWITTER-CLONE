const mongoose = require("mongoose");
const { Schema } = mongoose;

//here is the schema for a tweet

const tweetSchema = new mongoose.Schema(
  {
    Content: {
      type: String,
      required: true,
    },
    TweetedBy: {
      type: Schema.Types.ObjectId,
      ref: "UserModel",
    },
    Likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        default: [],
      },
    ],
    RetweetBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        default: [],
      },
    ],
    Image: {
      type: String,
    },
    Replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "TweetModel",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TweetModel", tweetSchema);
