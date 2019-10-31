const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const gameSchema = new Schema(
  {
    gameName: {
      type: String,
      default: "ObscurA 7.5"
    },
    live: {
      type: Boolean,
      default: false
    },
    admin: {
      username: String,
      password: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = Game = mongoose.model("gamepad", gameSchema);
