const dotenv = require("dotenv");
dotenv.config();
const { Recipe } = require("../../models");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async deleteRecipe(_, { deleteRecipeInput: { recipeId, userId } }) {
      await Recipe.destroy({
        where: {
          id: recipeId,
          userId,
        },
      });

      return "ok";
    },
    async createRecipe(_, { createRecipeInput: { link, name, userId } }) {
      const newRecipe = await Recipe.create({
        link,
        name,
        userId,
      });

      return newRecipe;
    },
    async updateRecipeName(
      _,
      { updateRecipeNameInput: { recipeId, newName, userId } }
    ) {
      const foundRecipe = await Recipe.findOne({
        where: {
          id: recipeId,
          userId,
        },
      });

      foundRecipe.name = newName;

      await foundRecipe.save();

      return foundRecipe;
    },
  },
  Query: {
    async recipe(_, { id }) {
      return await Recipe.findByPk(id);
    },
    async getRecipesByUser(_, { userId }) {
      const list = await Recipe.findAll({
        where: {
          userId,
        },
      });
      return list;
    },
  },
};
