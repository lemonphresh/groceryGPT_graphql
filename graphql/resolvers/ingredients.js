const dotenv = require("dotenv");
dotenv.config();
const { Ingredient } = require("../../models");

module.exports = {
  Mutation: {
    async deleteIngredient(
      _,
      { deleteIngredientInput: { ingredientsToDelete, userId } }
    ) {
      ingredientsToDelete
        .split(",")
        .forEach(
          async (item) =>
            await Ingredient.destroy({ where: { name: item.trim(), userId } })
        );

      return `ingredients deleted: ${ingredientsToDelete}`;
    },
    async editUserIngredients(
      _,
      { editUserIngredientsInput: { input, userId } }
    ) {
      const ingredientsList = await Ingredient.findAll({
        where: {
          userId: userId,
        },
      });

      ingredientsList.forEach(() => Ingredient.destroy({ where: { userId } }));

      input.forEach(
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
