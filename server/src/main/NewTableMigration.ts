import { DataTypes, DefineAttributes, QueryInterface, SequelizeStatic } from "sequelize";

export class NewTableMigration {
   /**
    * A class used for easy creation of migrations that create new tables.
    * It already contains the ID, createdAt and updatedAt fields.
    * It also contains the definitions of the `up` and `down` method
    *
    * @param tableName The name of the table to be created
    * @param attributeInitializer A callback that returns the definitions of the table fields
    */
   constructor(
      private readonly tableName: string,
      private readonly attributeInitializer: (dataTypes: DataTypes) => DefineAttributes) {
   }

   /**
    * Create the table
    *
    * @param queryInterface The interface to the database
    * @param sequelize The database connection
    */
   public up(queryInterface: QueryInterface, sequelize: SequelizeStatic): Promise<void> {
      const attributes: DefineAttributes = this.attributeInitializer(sequelize);

      attributes.id = {
         allowNull: false,
         autoIncrement: true,
         defaultValue: (): number => Math.floor(Math.random() * 10000),
         primaryKey: true,
         type: sequelize.INTEGER,
      };

      attributes.createdAt = {
         allowNull: false,
         type: sequelize.DATE,
      };

      attributes.updatedAt = {
         allowNull: false,
         type: sequelize.DATE,
      };

      return queryInterface.createTable(this.tableName, attributes);
   }

   /**
    * Drop(delete) the table
    *
    * @param queryInterface The interface to the database
    * @param sequelize The database connection
    */
   public down(queryInterface: QueryInterface, sequelize: SequelizeStatic): Promise<void> {
      return queryInterface.dropTable(this.tableName);
   }
}
