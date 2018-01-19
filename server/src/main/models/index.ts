import * as fs from "fs";
import * as path from "path";
import * as sequelize from "sequelize";
import { Log } from "../Log";
import { ModelContainer } from "../model";
import { EdgeModel } from "./edge";
import { StationModel } from "./station";

Log.DB("Initializing...");

const database: sequelize.Sequelize = connect();

// Models
const models: ModelContainer = {
   Edge: getModel("edge"),
   Station: getModel("station"),
};
export const Station: StationModel = models.Station;
export const Edge: EdgeModel = models.Edge;

// Helper functions
const abstractModels: { [modelName: string]: any } = models;

/**
 * @return An object through which a database can be accessed
 */
function connect(): sequelize.Sequelize {
   Log.DB("Connecting...");
   const env: string = process.env.NODE_ENV || "development";
   Log.DB("Environment: " + env);

   const configPath: string = path.resolve(__dirname, "../../../config/sequelize.js");
   const config: any = require(configPath)[env];
   const databaseUri: string = config.use_env_variable
      ? (process.env[config.use_env_variable] || "")
      : "";

   Log.DB("Sequelize with database: " + databaseUri || config.database);

   return databaseUri
      ? new sequelize(databaseUri, config)
      : new sequelize(config.database, config.username, config.password, config);
}

/**
 * Import a file containing a model and fetch the model object defined in it.
 *
 * @param modelName The name of the file (without the .js extension) where the model is defined
 */
function getModel(modelName: string): sequelize.Model<any, any> {
   const modelPath: string = path.resolve(__dirname, modelName + ".js");
   const result: sequelize.Model<any, any> = database.import(modelPath);
   Log.DB("Imported model from " + modelPath + " with name " + (result as any).name);
   return result;
}

for (const modelName in abstractModels) {
   if (abstractModels[modelName].name !== modelName) {
      throw new Error("Incorrect model name: '" + abstractModels[modelName].name +
         "' (expected '" + modelName + "')");
   }
   if (abstractModels[modelName].associate) {
      Log.DB("Associating model " + modelName);
      abstractModels[modelName].associate(models);
   }
}