import { DataTypes, DefineAttributes } from "sequelize";
import { NewTableMigration } from "../NewTableMigration";

export = new NewTableMigration("Routes", (types: DataTypes): DefineAttributes => ({
   routeNumber: {
      allowNull: false,
      type: types.INTEGER,
   },

   vehicleType: {
      allowNull: false,
      type: types.STRING,
   },
}));
