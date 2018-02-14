import { Promise } from "bluebird";
import { DataTypes, DefineAttributes, QueryInterface, SequelizeStatic } from "sequelize";
import { Log } from "./Log";
import { StandardAttributes, StandardInstance } from "./model";

export class PopulateTableSeeder<TAttributes extends StandardAttributes> {

   /**
    * A class used for easy creation of seeders that populate tables.
    * The attributes will have the createdAt and updatedAt fields added to them.
    * It also contains the definitions of the `up` and `down` method.
    *
    * WARNING: The table is cleared in the 'up' method and in the 'down' method!
    *
    * @param tableName The name of the table to be populated
    */
   constructor(
      private readonly tableName: string,
      private readonly attributeInitializer: () => Promise<TAttributes[]>) {
   }

   /**
    * Populate the table
    *
    * @param queryInterface The interface to the database
    * @param sequelize The database connection
    */
   public up(queryInterface: QueryInterface): Promise<void> {
      return this.clearTable(queryInterface).then((): Promise<TAttributes[]> => {
         Log.DB("Initializing the seed attributes...");
         return this.attributeInitializer();
      }).then((attributes: TAttributes[]): any => {
         Log.DB("Adding 'createdAt' and 'updatedAt' properties to the attributes...");
         for (const attribute of attributes) {
            attribute.createdAt = new Date();
            attribute.updatedAt = new Date();
         }

         if (attributes.length === 0) {
            Log.DB("Nothing to add to table '" + this.tableName + "'!");
            return Promise.resolve();
         }

         Log.DB("Populating table '" + this.tableName + "' with " + attributes.length +
            " records...");
         return queryInterface.bulkInsert(this.tableName, attributes);
      }).then((): void => {
         Log.DB("Done populating table '" + this.tableName + "'");
      });
   }

   /**
    * Empty the table
    *
    * @param queryInterface The interface to the database
    */
   public down(queryInterface: QueryInterface): Promise<void> {
      return this.clearTable(queryInterface);
   }

   private clearTable(queryInterface: QueryInterface): Promise<void> {
      Log.DB("Clearing table '" + this.tableName + "'...");
      return queryInterface.bulkDelete(this.tableName, {}).then((): void => {
         Log.DB("Done clearing table '" + this.tableName + "'");
      });
   }
}
