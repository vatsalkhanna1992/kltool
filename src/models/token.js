const mongoose = require("mongoose");
const validator = require("validator");

const appSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Please enter valid email.");
        }
      },
    },
    app_name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    app_url: {
      type: String,
      required: true,
    },
    app_secret: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

appSchema.path("app_url").validate((val) => {
  urlRegex =
    /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
  return urlRegex.test(val);
}, "Invalid URL.");

const Apps = mongoose.model("Apps", appSchema);

module.exports = Apps;
