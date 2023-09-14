const typeDefs = `#graphql
  type Ingredient {
    list: [String]
    createdAt: String
    createdBy: String
  }

  type User {
    id: ID!
    username: String
    email: String
    password: String
    token: String
  }

  input IngredientInput {
    list: [String]
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

  type Query {
    ingredient(id: ID!): Ingredient
    user(id: ID!): User
  }

  type Mutation {
    createIngredient(ingredientInput: IngredientInput): Ingredient!
    loginUser(loginInput: LoginInput): User
    registerUser(registerInput: RegisterInput): User
  }
`;

module.exports = typeDefs;
