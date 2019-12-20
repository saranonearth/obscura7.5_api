const {
  verifyToken,
  getCreatePlayer,
  generateToken,
  createGameTeam,
  getPlayer
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
    }

    //   async sendInvite(_, { teamId, playerId }, context) {
    //     const player = await checkAuth(context);
    //     console.log("player", player);
    //     return "YOYO";
    //   }
  },
  Query: {
    async getGamePlayer(_, a, context) {
      const player = await checkAuth(context);

      const Player = await getPlayer(player._id);
      console.log(Player);
      const { name, gameName, image, firstTime, email, group } = Player;
      return {
        name,
        gameName,
        image,
        firstTime,
        email,
        group
      };
    }
  }
};
