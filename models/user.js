const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash the password before saving the user
User.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// Method to compare entered password with hashed password
User.prototype.isValidPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
