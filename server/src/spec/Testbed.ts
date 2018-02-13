import { Promise } from "bluebird";
import * as _ from "lodash";
import { Model } from "sequelize";
import { AnyInstance } from "../main/model";
import { Edge, Route, RoutePoint, Station } from "../main/models";
import { EdgeInstance } from "../main/models/edge";
import { RouteInstance } from "../main/models/route";
import { RoutePointInstance } from "../main/models/route-point";
import { StationAttributes, StationInstance } from "../main/models/station";

export class Testbed {
   public static routes: RouteInstance[] = [];
   public static edges: EdgeInstance[] = [];
   public static stations: StationInstance[] = [];
   public static routePoints: RoutePointInstance[] = [];

   public static createRoute(): Promise<RouteInstance> {
      return Route.create({
         routeNumber: 5,
         vehicleType: "bus",
      }).then((result: RouteInstance): RouteInstance => {
         Testbed.routes.push(result);
         return result;
      });
   }

   public static createEdge(station1: StationInstance,
      station2: StationInstance): Promise<EdgeInstance> {

      return Edge.create({
         chance: 0.5,
         fromStationId: station1.id,
         toStationId: station2.id,
         travelTimeMs: 1800,
      }).then((result: EdgeInstance): EdgeInstance => {
         Testbed.edges.push(result);
         return result;
      });
   }

   public static createStation(attributes?: StationAttributes): Promise<StationInstance> {
      const defaultAttributes: StationAttributes = {
         name: "some-station",
         stationNumber: "0" + Math.floor(Math.random() * 1000000).toString(),
         latitude: 1.12,
         longtitude: 1.52,
         conductorAt: 1285182,
      };
      attributes = _.defaults(attributes || {}, defaultAttributes);

      return Station.create(attributes).then((result: StationInstance): StationInstance => {
         Testbed.stations.push(result);
         return result;
      });
   }

   public static createRoutePoint(route: RouteInstance, station: StationInstance): Promise<RoutePointInstance> {
      return RoutePoint.create({
         index: 2,
         isReversed: false,
         routeId: route.id,
         stationId: station.id,
      }).then((result: RoutePointInstance): RoutePointInstance => {
         Testbed.routePoints.push(result);
         return result;
      });
   }

   public static destroyAll(): Promise<void> {
      const result: Promise<void> = Promise.all([
         Testbed.destroy(Testbed.edges),
         Testbed.destroy(Testbed.routes),
         Testbed.destroy(Testbed.stations),
      ]).then((): void => { return; });

      Testbed.edges = [];
      Testbed.routes = [];
      Testbed.stations = [];

      return result;
   }

   private static destroy(instances: AnyInstance[]): Promise<void> {
      const promises: Array<Promise<void>> = [];
      for (const instance of instances) {
         promises.push(instance.destroy());
      }
      return Promise.all(promises).then((): void => { return; });
   }
}
