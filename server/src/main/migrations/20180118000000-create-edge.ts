import { DataTypes, DefineAttributes } from "sequelize";
import { NewTableMigration } from "../NewTableMigration";

export = new NewTableMigration("Edges", (types: DataTypes): DefineAttributes => ({
   chance: {
      allowNull: false,
      type: types.DOUBLE,
   },
   fromStationId: {
      allowNull: false,
      references: { model: "Stations" },
      type: types.INTEGER,
   },
   toStationId: {
      allowNull: false,
      references: { model: "Stations" },
      type: types.INTEGER,
   },
   travelTimeMs: {
      allowNull: false,
      type: types.INTEGER,
   },
}));