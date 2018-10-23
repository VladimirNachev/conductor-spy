import * as sequelize from "sequelize";
import { DataTypes, Sequelize } from "sequelize";
import { ModelContainer, StandardAttributes, StandardInstance } from "../model";

export interface EdgeAttributes extends StandardAttributes {
   /** Station A */
   fromStationId?: number;
   /** Station B */
   toStationId?: number;
   /** The chance that a conductor moves from station A to station B, from 0.0 to 1.0 */
   chance?: number;
   /** The milliseconds it takes a conductor to move from station A to station B */
   travelTimeMs?: number;
}

export interface EdgeInstance extends StandardInstance<EdgeAttributes> {
   /** Station A */
   fromStationId: number;
   /** Station B */
   toStationId: number;
   /** The chance that a conductor moves from station A to station B, from 0.0 to 1.0 */
   chance: number;
   /** The milliseconds it takes a conductor to move from station A to station B */
   travelTimeMs: number;

   getFromStation(): any;
   getToStation(): any;
}

export type EdgeModel = sequelize.Model<EdgeInstance, EdgeAttributes>;

export default function (database: Sequelize, types: DataTypes): EdgeModel {
   const edge: EdgeModel = database.define<EdgeInstance, EdgeAttributes>("Edge", {
      chance: {
         allowNull: false,
         type: types.DOUBLE,
      },
      travelTimeMs: {
         allowNull: false,
         type: types.INTEGER,
      },
   });

   (edge as any).associate = (models: ModelContainer): void => {
      edge.belongsTo(models.Station, {
         foreignKey: "fromStationId",
         as: "fromStation",
      });
      edge.belongsTo(models.Station, {
         foreignKey: "toStationId",
         as: "toStation",
      });
   };

   return edge;
}
