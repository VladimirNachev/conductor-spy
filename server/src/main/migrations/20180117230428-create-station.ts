import { DataTypes, DefineAttributes } from "sequelize";
import { NewTableMigration } from "../NewTableMigration";

export = new NewTableMigration("Stations", (types: DataTypes): DefineAttributes => ({
   name: {
      allowNull: false,
      type: types.STRING,
   },

   stationNumber: {
      allowNull: false,
      unique: true,
      type: types.STRING,
   },

   latitude: {
      allowNull: false,
      type: types.DOUBLE,
   },

   longtitude: {
      allowNull: false,
      type: types.DOUBLE,
   },

   conductorAt: {
      allowNull: false,
      type: types.BIGINT,
   },

   conductorWithPoliceAt: {
      allowNull: false,
      type: types.BIGINT,
   },
}));
