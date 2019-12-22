const {
  verifyToken,
  getCreatePlayer,
  generateToken,
  createGameTeam,
  getPlayer,
  getTeam,
  getlevel,
  getLevels,
  getStream
} = require("../util/resolverHelpers");
const checkAuth = require("../util/checkAuth");
const Team = require("../models/team");

module.exports = {
  Mutation: {
    async auth(_, { token }) {
      try {
        const ticket = await verifyToken(token);
        const userId = await getCreatePlayer(ticket);
        const jwtToken = await generateToken({ id: userId, isAuth: true });

        return {
          token: jwtToken
        };
      } catch (error) {
        console.log(error);
        throw new Error("Authentication Failed");
      }
    },
    async createTeam(_, data, context) {
      const player = await checkAuth(context);

      const team = await createGameTeam(data, player);
      console.log("TEAMHERE", team);
      return {
        id: team._id,
        teamName: team.teamName,
        image: team.image,
        bio: team.bio,
        curlevel: team.curlevel,
        stream: team.stream,
        answerset: team.answerset,
        members: team.members,
        teamAdmin: team.teamAdmin,
        uniqueKey: team.uniqueKey,
        invitations: team.invitations
      };
    },
    async sendInvite(_, { teamId }, context) {
      const player = await checkAuth(context);
      const team = await getTeam(teamId);

      let invitations = team.invitations;
      console.log(invitations);

      const checkAlready = invitations.find(
        e => e.player.toString() === player._id.toString()
      );
      console.log("CHECK", checkAlready);

      if (checkAlready) {
        return "Already invitation sent";
      }
      invitations.push({
        player: player._id
      });

      team.invitations = invitations;

      await team.save();

      return "Invitation sent successfully.";
    },
    async acceptInvite(_, { playerId, inviteId }, context) {
      const adminPlayer = await checkAuth(context);
      const team = await getTeam(adminPlayer.group);

      //should be admin
      console.log(adminPlayer._id.toString() === team.teamAdmin.toString());
      if (adminPlayer._id.toString() === team.teamAdmin.toString()) {
        console.log("HERE");

        // updating team member

        let newMembers = team.members;

        if (
          newMembers.find(e => e.player._id.toString() === playerId.toString())
        ) {
          console.log("FUCKIN");
          throw new Error(
            "Player to be added to the team is already a member."
          );
        } else {
          newMembers.push({
            player: playerId,
            solvedLevels: [],
            levelsSolved: 0
          });

          team.members = newMembers;

          await team.save();

          // updating player
          const iplayer = await getPlayer(playerId, "WITHOUT_TEAM");
          iplayer.group = team._id;
          await iplayer.save();

          // updating invitations
          let Invitations = team.invitations;
          const newInvitations = Invitations.filter(
            e => e._id.toString() !== inviteId.toString()
          );

          team.invitations = newInvitations;
          const res = await team.save();

          const newTeam = await res.populate("members.player").execPopulate();
          console.log(newTeam);
          const {
            _id,
            teamName,
            image,
            curlevel,
            stream,
            answerset,
            members,
            teamAdmin,
            uniqueKey,
            invitations,
            bio,
            levelsSolved
          } = newTeam;
          return {
            id: _id,
            teamName,
            image,
            curlevel,
            stream,
            answerset,
            members,
            teamAdmin,
            uniqueKey,
            invitations,
            bio,
            levelsSolved
          };
        }
      } else {
        throw new Error("Requesting player is not the admin");
      }
    }
  },
  Query: {
    async getGamePlayer(_, a, context) {
      const player = await checkAuth(context);

      const Player = await getPlayer(player._id, "WITH_TEAM");
      console.log(Player);
      const { _id, name, gameName, image, firstTime, email, group } = Player;
      return {
        id: _id,
        name,
        gameName,
        image,
        firstTime,
        email,
        group
      };
    },
    async getGameTeam(_, { teamId }) {
      if (!teamId) {
        throw new Error("No team ID found");
      }
      console.log(teamId);
      const team = await getTeam(teamId);
      console.log(team);
      return {
        teamName: team.teamName,
        image: team.image,
        curlevel: team.curlevel,
        stream: team.stream,
        answerset: team.answerset,
        members: team.members,
        teamAdmin: team.teamAdmin,
        uniqueKey: team.uniqueKey,
        invitations: team.invitations,
        levelsSolved: team.levelsSolved
      };
    },
    async getParticularPlayer(_, { playerId }, context) {
      const player = await getPlayer(playerId, "WITH_TEAM");
      console.log("PLAYER", player);

      return {
        id: player._id,
        name: player.name,
        gameName: player.gameName,
        image: player.image,
        firstTime: player.firstTime,
        email: player.email,
        group: player.group
      };
    },
    async getTeamInvitations(_, a, context) {
      const player = await checkAuth(context);

      const playerTeam = await getTeam(player.group);
      const popPlayerTeam = await playerTeam
        .populate("invitations.player")
        .execPopulate();
      const invitations = popPlayerTeam.invitations;

      return invitations;
    },
    async getAllTeams(_, { skip }) {
      try {
        const teams = await Team.find({})
          .limit(10)
          .skip(skip)
          .sort("-levelsSolved")
          .exec();
        const count = await Team.countDocuments({});
        return {
          teamCount: count,
          teams
        };
      } catch (error) {
        throw new Error("Teams could not be fetched.", error);
      }
    },
    async getLevel(_, { levelId }, context) {
      await checkAuth(context);

      const level = await getlevel(levelId);

      return {
        id: levelId,
        data: level.file,
        rlevelNo: level.rlevelNo
      };
    },
    async getTeamLevels(_, a, context) {
      const player = await checkAuth(context);
      const popPlayer = await player.populate("group").execPopulate();
      const team = popPlayer.group;
      const curLevel = team.curlevel.levelNo;
      const stream = team.stream;
      const gameStream = await getStream(stream);
      const index = gameStream[0].levels.map(e => e.levelNo).indexOf(curLevel);
      const teamLevels = gameStream[0].levels.slice(0, index + 1);
      return teamLevels;
    }
  }
};
