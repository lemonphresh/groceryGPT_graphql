const ingredients = require("./ingredients");
const users = require("./users");

module.exports = {
  Query: {
    ...ingredients.Query,
    ...users.Query,
  },
  Mutation: {
    ...ingredients.Mutation,
    ...users.Mutation,
  },
};
