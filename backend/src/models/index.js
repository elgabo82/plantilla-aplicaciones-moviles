const { sequelize } = require("../config/database");
require("dotenv").config();

const tablePrefix = process.env.TABLE_PREFIX || "";

const Book = require("./Book")(sequelize, tablePrefix);

async function syncDb() {
  await sequelize.authenticate();
  await sequelize.sync(); // crea tablas si no existen
}

module.exports = { sequelize, models: { Book }, syncDb };
