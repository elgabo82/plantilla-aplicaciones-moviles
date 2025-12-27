const { DataTypes } = require("sequelize");

module.exports = (sequelize, tablePrefix) => {
  return sequelize.define("Book", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(180), allowNull: false },
    author: { type: DataTypes.STRING(120), allowNull: false },
    year: { type: DataTypes.INTEGER, allowNull: true },
    isbn: { type: DataTypes.STRING(20), allowNull: true }
  }, {
    tableName: `${tablePrefix}books`
  });
};
