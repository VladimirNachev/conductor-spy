'use strict';

var fs: any        = require('fs');
var path: any      = require('path');
var Sequelize: any = require('sequelize');
var basename: string  = path.basename(__filename);
var env: string       = process.env.NODE_ENV || 'development';
var config: any    = require(__dirname + '/..\..\..\src\main\config\config.js')[env];
var db: any        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter((file: string): boolean => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach((file: string): void => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName: string): void => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
