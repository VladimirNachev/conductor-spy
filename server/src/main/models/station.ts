import { DataTypes, Sequelize } from "sequelize";
import * as sequelize from "sequelize";
import { ModelContainer, StandardAttributes, StandardInstance } from "../model";

export interface StationAttributes extends StandardAttributes {
   name?: string;
   stationNumber?: string;
   latitude?: number;
   longtitude?: number;
   conductorAt?: string | number;
}

export interface StationInstance extends StandardInstance<StationAttributes> {
   name: string;
   stationNumber: string;
   latitude: number;
   longtitude: number;
   conductorAt: string;
}

export type StationModel = sequelize.Model<StationInstance, StationAttributes>;

export default function (database: Sequelize, types: DataTypes): StationModel {
   const station: StationModel = database.define("Station", {
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
         type: types.INTEGER,
      },
   });

   (station as any).associate = (models: ModelContainer): void => {
      station.hasMany(models.RoutePoint, {
         foreignKey: "stationId",
         onDelete: "cascade",
         hooks: true,
      });
      station.hasMany(models.Edge, {
         foreignKey: "fromStationId",
         onDelete: "cascade",
         hooks: true,
      });
      station.hasMany(models.Edge, {
         foreignKey: "toStationId",
         onDelete: "cascade",
         hooks: true,
      });
      station.hasMany(models.ConductorArrival, {
         foreignKey: "stationId",
         onDelete: "cascade",
         hooks: true,
      });
   };

   return station;
}
