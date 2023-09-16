const dotenv = require("dotenv");
dotenv.config();
const { user } = require("../../models/user");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../../models");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { email, password, username } }) {
      const oldUser = await user(sequelize).findAll({ where: { email } });

      if (oldUser) {
        throw new ApolloError(
          `A user is already registered with the email ${email}.`,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new user(sequelize)({
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
      const foundUser = await user(sequelize).findOne({ email });

      if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
        const token = jwt.sign(
          {
            user_id: foundUser._id,
            email,
          },
          jwtKey,
          {
            expiresIn: "2h",
          }
        );

        foundUser.token = token;

        return {
          id: foundUser._id,
          ...foundUser._doc,
        };
      }

      throw new ApolloError("Incorrect password.", "INCORRECT_PASSWORD");
    },
  },
  Query: {
    user: (_, { ID }) => user.findById(ID),
  },
};
