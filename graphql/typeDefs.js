const typeDefs = `#graphql
  scalar Date

  type User {
    id: ID!
    username: String
    email: String
    password: String
    token: String
  }

  input RegisterInput {
    username: String
    email: String
    password: String
    confirmedPassword: String
  }

  input LoginInput {
    email: String
    password: String
  }

  type Ingredient {
    name: String
    userId: ID!
  }

  input EditUserIngredientsInput {
    input: [String]
    userId: ID!
  }

  input ClearUserIngredientsInput {
    userId: ID!
  }

  input DeleteIngredientInput {
    userId: ID!
    name: String
  }

  type Recipe {
    id: ID!
    name: String
    userId: ID!
    link: String
    createdAt: Date
  }
  
  input DeleteRecipeInput {
    userId: ID!
    recipeId: ID!
  }

  input CreateRecipeInput {
    userId: ID!
    name: String
    link: String
  }

  input UpdateRecipeNameInput {
    userId: ID!
    newName: String
    recipeId: ID!
  }

  type Query {
    user(id: ID!): User
    getIngredientsByUser(userId: ID!): [Ingredient]
    recipe(id: ID!): Recipe
    getRecipesByUser(userId: ID!): [Recipe]
  }

  type Mutation {
    clearUserIngredients(clearUserIngredientsInput: ClearUserIngredientsInput): String
    createRecipe(createRecipeInput: CreateRecipeInput): Recipe
    deleteIngredient(deleteIngredientInput: DeleteIngredientInput): String
    deleteRecipe(deleteRecipeInput: DeleteRecipeInput): String
    editUserIngredients(editUserIngredientsInput: EditUserIngredientsInput): [Ingredient]
    loginUser(loginInput: LoginInput): User
    registerUser(registerInput: RegisterInput): User
    updateRecipeName(updateRecipeNameInput: UpdateRecipeNameInput): Recipe
  }
`;

module.exports = typeDefs;
