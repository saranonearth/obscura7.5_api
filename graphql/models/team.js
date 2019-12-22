const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    teamName: String,
    image: String,
    curlevel: {
      levelNo: Number,
      level: Schema.Types.ObjectId
    },
    levelsSolved: {
      type: Number,
      default: 0
    },
    stream: String,
    answerset: String,
    bio: String,
    members: [
      {
        player: {
          type: Schema.Types.ObjectId,
          ref: "players"
        },
        solvedLevels: [
          {
            levelNo: Number
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
    invitations: [
      {
        player: {
          type: Schema.Types.ObjectId,
          ref: "players"
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = Team = mongoose.model("teams", teamSchema);
