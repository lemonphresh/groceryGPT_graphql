const typeDefs = `#graphql
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
    getIngredientsByUser(userId: ID!): [Ingredient]
  }

  type Mutation {
    clearUserIngredients(clearUserIngredientsInput: ClearUserIngredientsInput): String
    deleteIngredient(deleteIngredientInput: DeleteIngredientInput): String
    editUserIngredients(editUserIngredientsInput: EditUserIngredientsInput): [Ingredient]
    loginUser(loginInput: LoginInput): User
    registerUser(registerInput: RegisterInput): User
  }
`;

module.exports = typeDefs;
