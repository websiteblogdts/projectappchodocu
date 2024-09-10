// utils/passwordUtils.js
const bcrypt = require('bcrypt');
const saltRounds = 12; // Increase the cost factor for better security

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = {
  hashPassword,
  comparePassword,
};
