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

      if (oldUser) {
        throw new ApolloError(
          `A user is already registered with the email ${email}.`,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User(sequelize)({
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

      const res = await newUser.save();

      return {
        id: res._id,
        ...res._doc,
      };
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

        return {
          id: user._id,
          ...user._doc,
        };
      }

      throw new ApolloError("Incorrect password.", "INCORRECT_PASSWORD");
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
