const dotenv = require("dotenv");
dotenv.config();
const { Ingredient } = require("../../models");

module.exports = {
  Mutation: {
    async deleteIngredient(_, { deleteIngredientInput: { name, userId } }) {
      Ingredient.destroy({
        where: {
          name,
          userId,
        },
      });

      return "ok";
    },
    async editUserIngredients(
      _,
      { editUserIngredientsInput: { input, userId } }
    ) {
      input
        .split(",")
        .forEach(
          async (item) => await Ingredient.create({ name: item.trim(), userId })
        );

      const updatedIngredientsList = await Ingredient.findAll({
        where: {
          userId: userId,
        },
      });

      return updatedIngredientsList;
    },
    async clearUserIngredients(_, { clearUserIngredientsInput: { userId } }) {
      const ingredientsList = await Ingredient.findAll({
        where: {
          userId: userId,
        },
      });

      ingredientsList.forEach(() => Ingredient.destroy({ where: { userId } }));

      return "ok";
    },
  },
  Query: {
    async getIngredientsByUser(_, { userId }) {
      const list = await Ingredient.findAll({
        where: {
          userId,
        },
      });
      return list;
    },
  },
};
