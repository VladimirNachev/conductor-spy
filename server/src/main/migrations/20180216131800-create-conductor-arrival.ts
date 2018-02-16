import { DataTypes, DefineAttributes } from "sequelize";
import { NewTableMigration } from "../NewTableMigration";

export = new NewTableMigration("ConductorArrivals", (types: DataTypes): DefineAttributes => ({
   arrivalTime: {
     allowNull: false,
     type: types.BIGINT,
   },

   stationId: {
     allowNull: false,
     references: {
       model: "Stations",
       key: "id",
     },
     type: types.INTEGER,
   },
}));
