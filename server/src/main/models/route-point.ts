import * as sequelize from "sequelize";
import { DataTypes, Sequelize } from "sequelize";
import { ModelContainer, StandardAttributes, StandardInstance } from "../model";

export interface RoutePointAttributes extends StandardAttributes {
   index?: number;
   subrouteIndex?: number;
   routeId?: string;
   stationId?: string;
}

export interface RoutePointInstance extends StandardInstance<RoutePointAttributes> {
   index: number;
   subrouteIndex: number;
   routeId: string;
   stationId: string;

   getRoute(): any;
   getStation(): any;
}

export type RoutePointModel = sequelize.Model<RoutePointInstance, RoutePointAttributes>;

export default function (database: Sequelize, types: DataTypes): RoutePointModel {
   const routePoint: RoutePointModel = database.define("RoutePoint", {
      index: {
         allowNull: false,
         type: types.INTEGER,
      },

      subrouteIndex: {
         allowNull: false,
         type: types.INTEGER,
      },
   });

   (routePoint as any).associate = (models: ModelContainer): void => {
      routePoint.belongsTo(models.Route, {
         foreignKey: "routeId",
         as: "route",
      });
      routePoint.belongsTo(models.Station, {
         foreignKey: "stationId",
         as: "station",
      });
   };

   return routePoint;
}
