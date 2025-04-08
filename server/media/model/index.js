const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    mimetype: { required: true, type: String },
    key: { required: true, type: String },
    url: { required: true, type: String },
  },
  { timestamps: true }
);

const MediaModel = mongoose.model("media", schema);

module.exports = MediaModel;
