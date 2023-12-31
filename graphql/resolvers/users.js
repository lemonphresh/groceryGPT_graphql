const dotenv = require("dotenv");
dotenv.config();
const User = require("../../models/user.js");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../../models");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { email, password, username } }) {
      const oldUser = await User(sequelize).findAll({ where: { email } });
      console.log(oldUser);
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

      console.log(newUser);
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
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
