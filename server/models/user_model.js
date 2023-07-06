const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
    },
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    Email: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Profile_Picture: {
      type: String,
      default:
        "https://1fid.com/wp-content/uploads/2022/06/no-profile-picture-4-1024x1024.jpg",
    },
    Location: {
      type: String,
    },
    DateOfBirth: {
      type: Date,
      default: new Date("2000-05-30T00:00:00.000+00:00"),
    },
    Followers: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        required: true,
        ref: "UserModel",
      },
    ],
    Following: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        required: true,
        ref: "UserModel",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserModel", userSchema);
