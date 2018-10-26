import * as fs from "fs";
import * as path from "path";
import { QueryInterface, SequelizeStatic } from "sequelize";
import { RouteAttributes, } from "../models/route";
import { PopulateTableSeeder } from "../PopulateTableSeeder";

interface RouteInfo {
   routeNumber: string;
   vehicleType: string;
   _routePoints: string[];
}

export = new PopulateTableSeeder<RouteAttributes>("Routes", (): Promise<RouteAttributes[]> => {
   const filePath: string = path.resolve(__dirname, "../../../resources/routes.json");
   const resources: RouteInfo[] = JSON.parse(fs.readFileSync(filePath).toString());

   return Promise.resolve(resources.map((info: RouteInfo): RouteAttributes => {
      return {
         routeNumber: info.routeNumber,
         vehicleType: info.vehicleType,
      };
   }));
});
