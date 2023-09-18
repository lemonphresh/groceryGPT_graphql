const User = require("./users");
const Ingredient = require("./ingredients");

module.exports = {
  Query: {
    ...Ingredient.Query,
    ...User.Query,
  },
  Mutation: {
    ...Ingredient.Mutation,
    ...User.Mutation,
  },
};
