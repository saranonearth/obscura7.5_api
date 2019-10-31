const { OAuth2Client } = require("google-auth-library");

const {
  verifyToken,
  getCreatePlayer,
  generateToken
} = require("../util/resolverHelpers");

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
    }
  }
};
