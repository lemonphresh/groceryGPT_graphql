const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  id: { type: String },
  username: { type: String, default: null },
  email: { type: String, unique: true },
  password: { type: String },
  token: { type: String },
});

module.exports = model("User", userSchema);
