import * as _ from "lodash";
import { AnyInstance, StandardAttributes } from "../main/model";
import { Edge, Route, RoutePoint, Station } from "../main/models";
import { EdgeAttributes, EdgeInstance } from "../main/models/edge";
import { RouteAttributes, RouteInstance } from "../main/models/route";
import { RoutePointAttributes, RoutePointInstance } from "../main/models/route-point";
import { StationAttributes, StationInstance } from "../main/models/station";

export class Testbed {
   public static routes: RouteInstance[] = [];
   public static edges: EdgeInstance[] = [];
   public static stations: StationInstance[] = [];
   public static routePoints: RoutePointInstance[] = [];

   public static lastAttributes: StandardAttributes;

   public static async createRoute(attributes?: RouteAttributes): Promise<RouteInstance> {
      const defaultAttributes: RouteAttributes = {
         routeNumber: "44-Б",
         vehicleType: "bus",
      };
      attributes = _.defaults(attributes || {}, defaultAttributes);
      Testbed.lastAttributes = attributes;

      const result: RouteInstance = await Route.create(attributes);
      Testbed.routes.push(result);
      return result;
   }

   public static async createEdge(station1: StationInstance,
      station2: StationInstance, attributes?: EdgeAttributes): Promise<EdgeInstance> {

      const defaultAttributes: EdgeAttributes = {
         chance: 0.5,
         fromStationId: station1 ? station1.id : undefined,
         toStationId: station2 ? station2.id : undefined,
         travelTimeMs: 1800,
      };
      attributes = _.defaults(attributes || {}, defaultAttributes);
      Testbed.lastAttributes = attributes;

      const result: EdgeInstance = await Edge.create(attributes);
      Testbed.edges.push(result);
      return result;
   }

   public static async createStation(attributes?: StationAttributes): Promise<StationInstance> {
      const defaultAttributes: StationAttributes = {
         name: "some-station",
         stationNumber: "0" + Math.floor(Math.random() * 1000000).toString(),
         latitude: 1.12,
         longtitude: 1.52,
         conductorAt: new Date().getTime().toString(),
      };
      attributes = _.defaults(attributes || {}, defaultAttributes);
      Testbed.lastAttributes = attributes;

      return Station.create(attributes).then((result: StationInstance): StationInstance => {
         Testbed.stations.push(result);
         return result;
      });
   }

   public static async createRoutePoint(route: RouteInstance, station: StationInstance,
      attributes?: RoutePointAttributes): Promise<RoutePointInstance> {

      const defaultAttributes: RoutePointAttributes = {
         index: 2,
         subrouteIndex: 12,
         routeId: route.id,
         stationId: station.id,
      };
      attributes = _.defaults(attributes || {}, defaultAttributes);
      Testbed.lastAttributes = attributes;

      const result: RoutePointInstance = await RoutePoint.create(attributes);
      Testbed.routePoints.push(result);
      return result;
   }

   public static async clear(): Promise<void> {
      await Testbed.destroyAll(Edge);
      await Testbed.destroyAll(RoutePoint);
      await Promise.all([
         await Testbed.destroyAll(Route),
         await Testbed.destroyAll(Station),
      ]);

      Testbed.edges = [];
      Testbed.routes = [];
      Testbed.stations = [];
   }

   private static async destroyAll(type: any): Promise<void> {
      const instances: AnyInstance[] = await type.findAll();
      await Testbed.destroy(instances);
   }

   private static destroy(instances: AnyInstance[]): Promise<void[]> {
      return Promise.all(instances.map((instance: AnyInstance) => instance.destroy()));
   }
}
