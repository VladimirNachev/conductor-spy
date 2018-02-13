import { DataTypes, DefineAttributes } from "sequelize";
import { NewTableMigration } from "../NewTableMigration";

export = new NewTableMigration("RoutePoints", (types: DataTypes): DefineAttributes => ({
   index: {
      allowNull: false,
      type: types.INTEGER,
   },

   subrouteIndex: {
      allowNull: false,
      type: types.INTEGER,
   },

   routeId: {
      allowNull: false,
      references: {
         model: "Routes",
         key: "id",
      },
      type: types.INTEGER,
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
