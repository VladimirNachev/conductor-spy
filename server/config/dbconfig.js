const sequelize = require("sequelize");

const config = {
   "development": {
      "username": "postgres",
      "password": "mysecretpassword",
      "database": "conductors-spy",
      "host": "localhost",
      "dialect": "postgres",
      "operatorsAliases": sequelize.Op,
   },
   "test": {
      "username": "postgres",
      "password": "mysecretpassword",
      "database": "conductors-spy-test",
      "host": "localhost",
      "dialect": "postgres",
      "operatorsAliases": sequelize.Op,
      "logging": false,
   },
   "production": {
      "username": "postgres",
      "password": "mysecretpassword",
      "database": "conductors-spy-production",
      "host": "127.0.0.1",
      "dialect": "postgres",
      "operatorsAliases": sequelize.Op,
   },
};

module.exports = config;
