const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    teamName: String,
    image: String,
    curlevel: Number,
    stream: String,
    set: String,
    memebers: [
      {
        player: {
          type: Schema.Types.ObjectId,
          ref: "players"
        },
        solvedLevels: [
          {
            level: Number
          }
        ],
        levelsSolved: {
          type: Number,
          default: 0
        }
      }
    ],
    teamAdmin: {
      type: Schema.Types.ObjectId,
      ref: "players"
    },
    uniqueKey: String,
    invitaions: [
      {
        player: Schema.Types.ObjectId
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = Team = mongoose.model("teams", teamSchema);
