import { Promise } from "bluebird";
import { Request, Response } from "express";
import * as _ from "lodash";
import * as sequelize from "sequelize";
import { ConductorInfo, ConductorUtil, StationWithConductorInfo } from "../conductor.util";
import { Log } from "../Log";
import { GeoLocation, MathUtil } from "../math.util";
import { Edge, Station } from "../models";
import { EdgeInstance } from "../models/edge";
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

interface StationResponse {
   id: number;
   name: string;
   distance: number;
   conductors: ConductorInfo[];
}

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
   const maxDistance: number = 1000;

   return Station.findAll().then((result: StationInstance[]): Promise<{ [id: number]: StationWithConductorInfo }> => {
      for (const station of result) {
         responses.push({
            id: station.id,
            name: station.name,
            distance: MathUtil.getDistanceInMeters(station, { longtitude, latitude }),
            conductors: [],
         });
      }
      responses = responses.filter((station: StationResponse): boolean =>
         station.distance < maxDistance);
      responses.sort((s1: any, s2: any): number => s1.distance - s2.distance);
      return ConductorUtil.getConductorArrivalInfo(responses);
   }).then((result: { [id: number]: StationWithConductorInfo }): any => {
      for (const station of responses) {
         station.conductors = result[station.id].conductors;
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

export default router;
