import { DataTypes, Sequelize } from "sequelize";
import * as sequelize from "sequelize";
import { ModelContainer, StandardAttributes, StandardInstance } from "../model";

export interface StationAttributes extends StandardAttributes {
  name?: string,
  latitude?: number,
  longtitude?: number,
  conductorAt?: number,
};

export interface StationInstance extends StandardInstance<StationAttributes> {
  name: string,
  latitude: number,
  longtitude: number,
  conductorAt: number,
}

export type StationModel = sequelize.Model<StationInstance, StationAttributes>;

export default function (database: Sequelize, types: DataTypes): StationModel {
   const station: StationModel = database.define("Station", {
     name: {
       allowNull: false,
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

   return station;
}
