const Ingredient = require("../../models/Ingredient");

module.exports = {
  Mutation: {
    async createIngredient(_, { ingredientInput: { list, username } }) {
      const newIngredient = new Ingredient({
        list: list,
        createdBy: username,
        createdAt: new Date().toISOString(),
      });

      const res = await newIngredient.save();
      // todo: remove these console logs
      console.log(res);
      return {
        id: res.id,
        ...res._doc,
      };
    },
  },
  Query: {
    ingredient: (_, { ID }) => Ingredient.findById(ID),
  },
};
