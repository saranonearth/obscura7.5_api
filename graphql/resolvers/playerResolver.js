const {
  verifyToken,
  getCreatePlayer,
  generateToken
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
    async sendInvite(_, { teamId, playerId }, context) {
      const player = await checkAuth(context);
      console.log("player", player);
      return "YOYO";
    }
  }
};
