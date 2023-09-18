const dotenv = require("dotenv");
dotenv.config();
const { ApolloError } = require("apollo-server-errors");
const User = require("../../models/user");
const Ingredient = require("../../models/ingredient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../../models");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { email, password, username } }) {
      const oldUser = await User(sequelize).findAll({ where: { email } });

      if (oldUser.length !== 0) {
        throw new ApolloError(
          `A user is already registered with the email ${email}.`,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = await User(sequelize).create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        createdAt: new Date().toISOString(),
      });

      const token = jwt.sign(
        {
          user_id: newUser._id,
          email,
        },
        jwtKey,
        {
          expiresIn: "2h",
        }
      );

      newUser.token = token;

      return newUser;
    },
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User(sequelize).findOne({ email });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            user_id: user._id,
            email,
          },
          jwtKey,
          {
            expiresIn: "2h",
          }
        );

        user.token = token;

        return user;
      }

      throw new ApolloError("Incorrect password.", "INCORRECT_PASSWORD");
    },
    async editUserIngredients(
      _,
      { editUserIngredientsInput: { input, userId } }
    ) {
      input
        .split(",")
        .forEach((item) =>
          Ingredient.create({ name: item.trim(), userId: userId })
        );

      const updatedIngredientsList = await Ingredient(sequelize).findAll({
        where: {
          userId: userId,
        },
      });

      return {
        id: userId,
        ingredients: updatedIngredientsList,
      };
    },
    async clearUserIngredients(_, { clearUserIngredientsInput: { userId } }) {
      const ingredientsList = await Ingredient(sequelize).findAll({
        where: {
          userId: userId,
        },
      });

      ingredientsList.forEach(() =>
        Ingredient(sequelize).destroy({ where: { userId } })
      );

      return {
        id: userId,
        ingredients: null,
      };
    },
  },
  Query: {
    async user(_, { id }) {
      return await User(sequelize).findByPk(id);
    },
    async getUserIngredientsList(_, { id }) {
      // for the love of god please help
      const user = await User(sequelize).findOne({
        where: {
          id,
        },
        include: [{ model: Ingredient(sequelize), as: "ingredients" }],
      });
      console.log(user);
      // return user;
    },
  },
};
