const { AuthenticationError } = require("apollo-server");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const Player = require("../models/player");
const Team = require("../models/team");
const Path = require("../models/stream");

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
    throw new Error("User neither be fetched nor created");
  }
};

//Function to generate jwt token
exports.generateToken = async data => {
  const payload = {
    ...data
  };

  const token = await jwt.sign(payload, process.env.JWTS, {
    expiresIn: "6h"
  });

  return token;
};

//Function to get the initial Stream's level
const initialCurlevel = async stream => {
  try {
    const path = await Path.find({ streamName: stream });

    return path[0].levels[0];
  } catch (error) {
    throw new Error("Could not fetch initial current level", error);
  }
};

//Function to determine the initial Stream and Path
const randomPathSet = () => {
  const answersets = ["beta1", "beta2", "beta3", "beta4"];
  const streams = ["alpha1", "alpha2", "alpha3", "alpha4"];

  let ran1 = Math.floor(Math.random() * 4);
  let ran2 = Math.floor(Math.random() * 4);
  const ran3 = Math.floor(Math.random() * 3);
  const ran4 = Math.floor(Math.random() * 2);

  if (ran2 > ran3) {
    ran2 = ran2 - ran3;
  } else {
    ran2 = ran3 - ran2;
  }

  if (ran1 > ran4) {
    ran1 = ran1 - ran4;
  } else {
    ran1 = ran4 - ran1;
  }

  return {
    answerset: answersets[ran1],
    stream: streams[ran2]
  };
};

//Function to get player
exports.getPlayer = async id => {
  try {
    const player = await Player.findOne({ _id: id });
    return player;
  } catch (error) {
    throw new Error("Error occured while fetching Player.");
  }
};

// Function to create team
exports.createGameTeam = async (data, player) => {
  const { teamName, bio, image, uniqueKey } = data;

  const game = randomPathSet();
  console.log("GAME", game);
  const curlevel = await initialCurlevel(game.stream);
  let members = [];
  members = [{ player: player._id, solvedLevels: [], levelsSolved: 0 }];

  try {
    const newTeam = new Team({
      teamName,
      bio,
      image,
      uniqueKey,
      stream: game.stream,
      answerset: game.answerset,
      curlevel,
      members,
      teamAdmin: player._id,
      invitations: []
    });

    const res = await newTeam.save();

    const admin = await this.getPlayer(player._id);
    admin.group = res._id;
    await admin.save();

    return res._doc;
  } catch (error) {
    throw new Error("Error occured while creating a new team.", error);
  }
};
