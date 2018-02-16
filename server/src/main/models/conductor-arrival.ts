import { DataTypes, Sequelize } from "sequelize";
import * as sequelize from "sequelize";
import { ModelContainer, StandardAttributes, StandardInstance } from "../model";
import { Log } from "../Log";

export interface ConductorArrivalAttributes extends StandardAttributes {
   arrivalTime?: string | number;
   stationId?: number;
}

export interface ConductorArrivalInstance extends StandardInstance<ConductorArrivalAttributes> {
  arrivalTime: string;
  stationId: number;
}

export type ConductorArrivalModel = sequelize.Model<ConductorArrivalInstance, ConductorArrivalAttributes>;

export default function (database: Sequelize, types: DataTypes): ConductorArrivalModel {
   const conductorArrival: ConductorArrivalModel = database.define("ConductorArrival", {
      arrivalTime: {
        allowNull: false,
        type: types.BIGINT,
      },
    });

   (conductorArrival as any).associate = (models: ModelContainer): void => {
      Log.DB("associating me......");
      Log.DB(models.Station);
      conductorArrival.belongsTo(models.Station, {
         foreignKey: "stationId",
         as: "station",
      });
   };

   return conductorArrival;
}
