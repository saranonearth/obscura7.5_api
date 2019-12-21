const {
  verifyToken,
  getCreatePlayer,
  generateToken,
  createGameTeam,
  getPlayer,
  getTeam
} = require("../util/resolverHelpers");
const checkAuth = require("../util/checkAuth");

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
        invitations: team.invitations
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
    }
  }
};
