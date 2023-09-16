const User = require("./users");

module.exports = {
  Query: {
    ...User.Query,
  },
  Mutation: {
    ...User.Mutation,
  },
};
