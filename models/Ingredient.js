const { model, Schema } = require("mongoose");

const ingredientSchema = new Schema({
  list: [String],
  createdAt: String,
  createdBy: String,
});

module.exports = model("Ingredient", ingredientSchema);
