const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const streamSchema = new Schema(
  {
    streamName: String,
    levels: [
      {
        levelNo: Number,
        level: {
          type: Schema.Types.ObjectId,
          ref: "levels"
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = Path = mongoose.model("streams", streamSchema);
