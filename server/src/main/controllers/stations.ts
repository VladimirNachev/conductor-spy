import { Promise } from "bluebird";
import { Request, Response } from "express";
import * as _ from "lodash";
import { Log } from "../Log";
import { Station } from "../models";
import { StationInstance } from "../models/station";

const router: any = require("express-promise-router")();

interface StationRequest extends Request {
   newParams: {
      id: string;
   };
}

function extractParams(req: StationRequest, res: Response): any {
   req.newParams = _.pick(req.params, ["id"]);

   return Promise.resolve("next");
}

interface GeoLocation {
   longtitude: number;
   latitude: number;
}

function toRadians(angle: number): number {
   return (angle / 180.0) * Math.PI;
}
function getDistanceCoefficient(pos1: GeoLocation, pos2: GeoLocation): number {
   if (pos1.latitude === pos2.latitude && pos1.longtitude === pos2.longtitude) {
      return 0;
   }
   return Math.acos(
      Math.sin(toRadians(pos1.latitude)) * Math.sin(toRadians(pos2.latitude)) +
      Math.cos(toRadians(pos1.latitude)) * Math.cos(toRadians(pos2.latitude)) *
      Math.cos(toRadians(pos2.longtitude - pos1.longtitude)));
}

router.get("/", extractParams, (req: StationRequest, res: Response): any => {
   return Station.findAll().then((stations: StationInstance[]): any => {
      const location: GeoLocation = {
         longtitude: req.query.longtitude || 0,
         latitude: req.query.latitude || 0,
      };
      return res.status(200).send(stations
         .sort((station1: StationInstance, station2: StationInstance): number => {
            return getDistanceCoefficient(station1, location) -
               getDistanceCoefficient(station2, location);
         }));
   });
});

router.get("/:id", extractParams, (req: StationRequest, res: Response): any => {
   return Station.findById(req.newParams.id)
      .then((station: StationInstance | null): any => {
         return res.status(200).send(station);
      });
});

export default router;
