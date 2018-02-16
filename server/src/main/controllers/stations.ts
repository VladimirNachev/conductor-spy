import { Promise } from "bluebird";
import { Request, Response } from "express";
import * as _ from "lodash";
import * as sequelize from "sequelize";
import { ConductorArrival, ConductorUtil, StationWithArrivalInfo } from "../conductor.util";
import { Log } from "../Log";
import { GeoLocation, MathUtil } from "../math.util";
import { Edge, Route, RoutePoint, Station } from "../models";
import { EdgeInstance } from "../models/edge";
import { RouteInstance } from "../models/route";
import { RoutePointInstance } from "../models/route-point";
import { StationInstance } from "../models/station";

const router: any = require("express-promise-router")();

interface StationRequest extends Request {
   newParams: {
      id: string;
   };
   queryParams: {
      longtitude?: string;
      latitude?: string;
   };
}

function extractParams(req: StationRequest, res: Response): Promise<string> {
   req.newParams = _.pick(req.params, [
      "id",
   ]);
   req.queryParams = _.pick(req.query, [
      "longtitude",
      "latitude",
   ]);

   return Promise.resolve("next");
}

interface RouteInfo {
   firstStationId: number;
   firstStationName: string;

   lastStationId: number;
   lastStationName: string;

   routeNumber: string;
   routeType: string;
}

interface StationResponse {
   id: number;
   name: string;
   distance: number;
   arrivals: ConductorArrival[];
   routes: RouteInfo[];
}

const maxDistance: number = 500;

router.get("/", extractParams, (req: StationRequest, res: Response): any => {
   const longtitude: number = parseFloat(req.queryParams.longtitude || "");
   const latitude: number = parseFloat(req.queryParams.latitude || "");
   if (isNaN(longtitude)) {
      return res.status(400).send("No 'longtitude' parameter");
   }
   if (isNaN(latitude)) {
      return res.status(400).send("No 'latitude' parameter");
   }

   let responses: StationResponse[] = [];

   type BulkResult1 = [{ [id: number]: StationWithArrivalInfo }, RoutePointInstance[]];
   type BulkResult2 = [RoutePointInstance[], RouteInstance[]];

   let routePoints: RoutePointInstance[];
   const routeMap: { [id: number]: RouteInstance } = {};

   return Station.findAll().then((result: StationInstance[]): Promise<BulkResult1> => {

      for (const station of result) {
         responses.push({
            id: station.id,
            name: station.name,
            distance: MathUtil.getDistanceInMeters(station, { longtitude, latitude }),
            arrivals: [],
            routes: [],
         });
      }
      responses = responses.filter((station: StationResponse): boolean =>
         station.distance < maxDistance);
      responses.sort((s1: any, s2: any): number => s1.distance - s2.distance);

      const stationIds: number[] = responses
         .map((station: StationResponse): number => station.id);

      return Promise.all([
         ConductorUtil.getConductorArrivalInfo(responses),
         RoutePoint.findAll({ where: { stationId: { [sequelize.Op.in]: stationIds } } }),
      ]);
   }).then((result: BulkResult1): Promise<BulkResult2> => {
      for (const station of responses) {
         station.arrivals = result[0][station.id].arrivals;
      }
      const routeIds: number[] = _.uniq(result[1]
         .map((routePoint: RoutePointInstance): number => routePoint.routeId));
      return Promise.all([
         RoutePoint.findAll({ where: { routeId: { [sequelize.Op.in]: routeIds } } }),
         Route.findAll({ where: { id: { [sequelize.Op.in]: routeIds } } }),
      ]);
   }).then((result: BulkResult2): Promise<StationInstance[]> => {
      routePoints = result[0];
      for (const route of result[1]) {
         routeMap[route.id] = route;
      }
      const routePointMap: { [stationId: number]: RoutePointInstance[] } = {};
      for (const routePoint of result[0]) {
         routePointMap[routePoint.stationId] = routePointMap[routePoint.stationId] || [];
         routePointMap[routePoint.stationId].push(routePoint);
      }

      result[0].sort((rp1: RoutePointInstance, rp2: RoutePointInstance): number => {
         if (rp1.routeId !== rp2.routeId) {
            return rp1.routeId - rp2.routeId;
         }
         if (rp1.subrouteIndex !== rp2.subrouteIndex) {
            return rp1.subrouteIndex - rp2.subrouteIndex;
         }
         return rp1.index - rp2.index;
      });
      const routePointIndices: { [id: number]: number } = {};
      for (let i: number = 0; i < result[0].length; i++) {
         routePointIndices[result[0][i].id] = i;
      }

      const stationsToGetNamesOf: number[] = [];

      for (const station of responses) {
         const stationRoutePoints: RoutePointInstance[] = routePointMap[station.id] || [];
         for (const routePoint of stationRoutePoints) {

            const index: number = routePointIndices[routePoint.id];
            const firstIndex: number = index - result[0][index].index;
            let lastIndex: number = index;
            while (lastIndex < result[0].length - 1
               && result[0][lastIndex + 1].index === result[0][lastIndex].index + 1) {
               lastIndex++;
            }
            stationsToGetNamesOf.push(result[0][firstIndex].stationId);
            stationsToGetNamesOf.push(result[0][lastIndex].stationId);

            const correspondingRoute: RouteInstance = routeMap[routePoint.routeId];

            station.routes.push({
               firstStationId: result[0][firstIndex].stationId,
               firstStationName: "",
               lastStationId: result[0][lastIndex].stationId,
               lastStationName: "",
               routeNumber: correspondingRoute.routeNumber,
               routeType: correspondingRoute.vehicleType,
            });
         }
      }

      return Station.findAll({
         where: { id: { [sequelize.Op.in]: _.uniq(stationsToGetNamesOf) } },
      });
   }).then((result: StationInstance[]): any => {
      const stationMap: { [id: number]: StationInstance } = {};
      for (const station of result) {
         stationMap[station.id] = station;
      }
      for (const station of responses) {
         for (const routeInfo of station.routes) {
            routeInfo.firstStationName = stationMap[routeInfo.firstStationId].name;
            routeInfo.lastStationName = stationMap[routeInfo.lastStationId].name;
         }
      }

      return res.status(200).send(responses);
   });
});

router.get("/:id", extractParams, (req: StationRequest, res: Response): Promise<any> => {
   return Station.findById(req.newParams.id)
      .then((station: StationInstance | null): any => {
         return res.status(200).send(station);
      });
});

router.put("/:id", extractParams, (req: StationRequest, res: Response): Promise<any> => {
   return Station.update(
      { conductorAt: new Date().getTime() },
      { where: { id: req.newParams.id } },
   ).then((station: [number, StationInstance[]]): any => {
      if (!station[0]) {
         return res.sendStatus(404);
      }

      return res.status(200).send(station);
   });
});

export default router;
