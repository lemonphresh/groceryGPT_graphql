const dotenv = require("dotenv");
dotenv.config();
const User = require("../../models/User");
const { ApolloError } = require("apollo-server-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT;
module.exports = {
  Mutation: {
    async registerUser(_, { registerInput: { email, password, username } }) {
      const oldUser = await User.findOne({ email });

      if (oldUser) {
        throw new ApolloError(
          `A user is already registered with the email ${email}.`,
          "USER_ALREADY_EXISTS"
        );
      }

      // should i encrypt the email too?
      const encryptedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
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
      // todo: remove these console logs
      console.log(res);

      return {
        id: res.id,
        ...res._doc,
      };
    },
    async loginUser(_, { loginInput: { email, password } }) {
      const user = await User.findOne({ email });

      if (user && (await bcrypt.compare(password, user.model))) {
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

        user.token = token;

        return {
          id: user.id,
          ...res._doc,
        };
      }

      throw new ApolloError("Incorrect password.", "INCORRECT_PASSWORD");
    },
  },
  Query: {
    user: (_, { ID }) => User.findById(ID),
  },
};
