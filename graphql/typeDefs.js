const typeDefs = `#graphql
  type Ingredient {
    name: String
    userId: ID!
  }

  type User {
    id: ID!
    username: String
    email: String
    password: String
    token: String
    ingredients: [Ingredient]
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

  input EditUserIngredientsInput {
    input: String
    userId: ID!
  }

  input ClearUserIngredientsInput {
    userId: ID!
  }

  input DeleteIngredientInput {
    userId: ID!
    name: String
  }

  type Query {
    user(id: ID!): User
    getUserIngredientsList(id: ID!): User
  }

  type Mutation {
    clearUserIngredients(clearUserIngredientsInput: ClearUserIngredientsInput): User
    deleteIngredient(deleteIngredientInput: DeleteIngredientInput): String
    editUserIngredients(editUserIngredientsInput: EditUserIngredientsInput): User
    loginUser(loginInput: LoginInput): User
    registerUser(registerInput: RegisterInput): User
  }
`;

module.exports = typeDefs;
