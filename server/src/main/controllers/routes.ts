import { Request, Response } from "express";
import * as _ from "lodash";
import { ConductorUtil, StationWithArrivalInfo } from "../conductor.util";
import { Log } from "../Log";
import { Route, RoutePoint } from "../models";
import { RouteInstance } from "../models/route";
import { RoutePointInstance } from "../models/route-point";

const router: any = require("express-promise-router")();

interface RouteRequest extends Request {
   newParams: {
      id: string;
   };
}

function extractParams(req: RouteRequest): any {
   req.newParams = _.pick(req.params, ["id"]);

   return Promise.resolve("next");
}

router.get("/", extractParams, (req: RouteRequest, res: Response): any => {
   Log.SERVER("Fetching all routes...");
   return Route.findAll()
      .then((routes: RouteInstance[]): any => {
         Log.SERVER(`Fetched ${routes.length} route${routes.length === 1 ? "" : "s"}`);
         return res.status(200).send(routes);
      });
});

router.get("/:id", extractParams, (req: RouteRequest, res: Response): any => {
   Log.SERVER(`Fetching route with ID ${req.newParams.id}`);
   return Route.findById(req.newParams.id).then((route: RouteInstance | null): any => {
      Log.SERVER(route === null
         ? `There is no route with ID ${req.newParams.id}`
         : `Fetched route with ID ${req.newParams.id} successfully`);
      return res.status(route === null ? 404 : 200).send(route);
   });
});

router.get("/:id/points", extractParams, async (req: RouteRequest, res: Response): Promise<any> => {
   Log.SERVER(`Fetching the points of route with ID ${req.newParams.id}`);
   const routePoints: RoutePointInstance[] = await RoutePoint.findAll({
      where: { routeId: req.newParams.id },
      order: [
         ["subrouteIndex", "ASC"],
         ["index", "ASC"],
      ],
   });

   const stationIds: string[] = routePoints
      .map((routePoint: RoutePointInstance): string => routePoint.stationId);

   const stationsWithArrivalInfo: { [id: string]: StationWithArrivalInfo } =
      await ConductorUtil.getConductorArrivalInfo(stationIds);

   const result: any[] = routePoints.map((routePoint: RoutePointInstance): any =>
      _.extend(_.pick(routePoint, "id", "index", "subrouteIndex"), {
         stationName: stationsWithArrivalInfo[routePoint.stationId].name,
         arrivals: stationsWithArrivalInfo[routePoint.stationId].arrivals,
      }));

   return res.status(200).send(result);
});

export default router;
