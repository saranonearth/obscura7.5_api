const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const levelSchema = new Schema(
  {
    rlevelNo: Number,
    file: String
  },
  {
    timestamps: true
  }
);

module.exports = Level = mongoose.model("levels", levelSchema);
