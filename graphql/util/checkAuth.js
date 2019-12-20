const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const Player = require("../models/player");

module.exports = async function(context) {
  const authHeader = context.req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];
    if (token) {
      try {
        const playerId = await jwt.verify(token, process.env.JWTS);
        const player = await Player.findById(playerId.id);
        if (!player) {
          throw new AuthenticationError("Player not found.");
        }
        return player;
      } catch (error) {
        throw new AuthenticationError("Token Invalid");
      }
    } else {
      throw new Error("Token not found in header");
    }
  } else {
    throw new Error("Authorization header not found");
  }
};
