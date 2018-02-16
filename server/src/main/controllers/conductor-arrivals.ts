import { Request, Response } from 'express';
import { Promise } from 'bluebird';
import { ConductorArrival } from '../models';
import { ConductorArrivalInstance } from '../models/conductor-arrival';
import * as _ from 'lodash';

const router: any = require("express-promise-router")();

interface ConductorArrivalRequest extends Request {
  newParams: {
    arrivalTime: string,
    stationId: number,
  },
}

function extractParams(req: ConductorArrivalRequest, res: Response): Promise<string> {
  req.newParams = _.pick(req.params, [
    "arrivalTime",
    "stationId",
  ]);
  return Promise.resolve('next');
}

router.get('/', (req: ConductorArrivalRequest, res: Response): Promise<any> => {
  return ConductorArrival.findAll()
  .then((conductorArrivals: ConductorArrivalInstance[]): any => {
    return res.status(200).send(conductorArrivals);
  });
});

router.post('/', extractParams, (req: ConductorArrivalRequest, res: Response): Promise<any> => {
  return ConductorArrival.create(req.newParams)
    .then((conductorArrival: ConductorArrivalInstance): any => {
      if (!conductorArrival) {
        return res.sendStatus(500);
      }

      return res.status(200).send(conductorArrival);
    });
});

export default router;
