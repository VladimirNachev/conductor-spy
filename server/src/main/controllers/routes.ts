import { Promise } from "bluebird";
import { Request, Response } from "express";
import * as _ from "lodash";
import * as sequelize from "sequelize";
import { ConductorUtil, StationWithConductorInfo } from "../conductor.util";
import { Log } from "../Log";
import { Edge, Route, RoutePoint, Station } from "../models";
import { EdgeInstance } from "../models/edge";
import { RouteInstance } from "../models/route";
import { RoutePointInstance } from "../models/route-point";
import { StationInstance } from "../models/station";

const router: any = require("express-promise-router")();

interface RouteRequest extends Request {
   newParams: {
      id: string;
   };
}

function extractParams(req: RouteRequest, res: Response): any {
   req.newParams = _.pick(req.params, ["id"]);

   return Promise.resolve("next");
}

router.get("/", extractParams, (req: RouteRequest, res: Response): any => {
   return Route.findAll()
      .then((routes: RouteInstance[]): any => {
         return res.status(200).send(routes);
      });
});

router.get("/:id", extractParams, (req: RouteRequest, res: Response): any => {
   return Route.findById(req.newParams.id)
      .then((route: RouteInstance | null): any => {
         return res.status(200).send(route);
      });
});

router.get("/:id/points", extractParams, (req: RouteRequest, res: Response): any => {
   let routePoints: RoutePointInstance[];

   return RoutePoint.findAll({
      where: { routeId: req.newParams.id },
   }).then((result: RoutePointInstance[]): Promise<{ [id: number]: StationWithConductorInfo }> => {
      routePoints = result;
      const stationIds: number[] = routePoints
         .map((routePoint: RoutePointInstance): number => routePoint.stationId);

      return ConductorUtil.getConductorArrivalInfo(stationIds);
   }).then((result: { [id: number]: StationWithConductorInfo }): any => {
      return res.status(200).send(routePoints.map((routePoint: RoutePointInstance): any => {
         return _.extend(_.pick(routePoint, "id", "index", "subrouteIndex"), {
            stationName: result[routePoint.stationId].name,
            conductors: result[routePoint.stationId].conductors,
         });
      }));
   });
});

export default router;
