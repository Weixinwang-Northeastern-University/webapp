const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const user = sequelize.define("User", {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  firstname: {
    type: Sequelize.STRING,
  },
  lastname: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
    select: false,
    writeonly: true,
  },
  username: {
    type: Sequelize.STRING,
    unique: true,
  },
});

module.exports = user;
