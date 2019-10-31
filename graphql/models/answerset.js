const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const answersetSchema = new Schema(
  {
    setName: String,
    answers: [
      {
        levelNo: Number,
        answer: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = Answersets = mongoose.model("answersets", answersetSchema);
