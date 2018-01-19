import { DataTypes, Sequelize } from "sequelize";
import * as sequelize from "sequelize";
import { StandardAttributes, StandardInstance } from "../model";

export type StationAttributes = StandardAttributes;
export type StationInstance = StandardInstance<StationAttributes>;

export type StationModel = sequelize.Model<StationInstance, StationAttributes>;

export default function (database: Sequelize, types: DataTypes): StationModel {
   const station: StationModel = database.define("Station", {});
   return station;
}
