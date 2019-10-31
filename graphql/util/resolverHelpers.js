const { AuthenticationError } = require("apollo-server");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const Player = require("../models/player");

// func to verify the token and get the user details
exports.verifyToken = async token => {
  const client = new OAuth2Client(process.env.GID);
  try {
    const res = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GID
    });

    return res.getPayload();
  } catch (error) {
    console.log(error);
    throw new AuthenticationError("Token cannot be verified", error);
  }
};

// func to get or create a player and return ID
exports.getCreatePlayer = async ticket => {
  const { email, name, picture } = ticket;

  try {
    const player = await Player.findOne({ email });

    if (player) {
      return player._doc._id;
    } else {
      const newPlayer = new Player({
        name,
        email,
        image: picture
      });

      const res = await newPlayer.save();
      return res._doc._id;
    }
  } catch (error) {
    throw new Error("User neither cant be fetcher nor created");
  }
};

//func to generate jwt token
exports.generateToken = async data => {
  const payload = {
    ...data
  };

  const token = await jwt.sign(payload, process.env.JWTS, {
    expiresIn: "6h"
  });

  return token;
};
