const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    name: String,
    gameName: String,
    email: {
      type: String,
      unique: true
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "groups",
      default: null
    },
    firstTime: {
      type: Boolean,
      default: true
    },
    image: String
  },
  {
    timestamps: true
  }
);

module.exports = Player = mongoose.model("players", playerSchema);
