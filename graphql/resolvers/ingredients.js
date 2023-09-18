const dotenv = require("dotenv");
dotenv.config();
const Ingredient = require("../../models/ingredient.js");
const { sequelize } = require("../../models");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async deleteIngredient(_, { deleteIngredientInput: { name, userId } }) {
      Ingredient(sequelize).destroy({
        where: {
          name,
          userId,
        },
      });

      return "ok";
    },
  },
  Query: {},
};
