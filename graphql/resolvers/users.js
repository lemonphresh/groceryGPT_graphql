const dotenv = require("dotenv");
dotenv.config();
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Ingredient } = require("../../models");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { email, password, username } }) {
      const oldUser = await User.findAll({ where: { email } });

      if (oldUser.length !== 0) {
        throw new ApolloError(
          `A user is already registered with the email ${email}.`,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email: email.toLowerCase(),
        password: encryptedPassword,
        createdAt: new Date().toISOString(),
      });

      const token = jwt.sign(
        {
          id: newUser.id,
          email,
        },
        jwtKey,
        {
          expiresIn: "2h",
        }
      );

      newUser.token = token;
      console.log();

      return newUser;
    },
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ where: { email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign(
          {
            id: user.id,
            email,
            username: user.username,
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
  },
  Query: {
    async user(_, { id }) {
      return await User.findByPk(id);
    },
  },
};
