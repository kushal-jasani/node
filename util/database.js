const Sequelize = require("sequelize");
const sequelize = new Sequelize("node", "root", "kush9531", {
    dialect: 'mysql',
    host:'localhost'
});
module.exports = sequelize;
