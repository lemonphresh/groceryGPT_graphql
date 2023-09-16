"use strict";
const { Model, DataTypes } = require("sequelize");
module.exports = {
  user: (sequelize) => {
    class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
      }
    }
    User.init(
      {
        id: {
          primaryKey: true,
          autoIncrement: true,
          type: DataTypes.INTEGER,
        },
        username: {
          type: DataTypes.STRING,
          unique: false,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [7, 42],
          },
        },
        token: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "User",
      }
    );
    return User;
  },
};
