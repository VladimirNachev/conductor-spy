import * as _ from "lodash";
import * as sequelize from "sequelize";
import { Log } from "./Log";
import { Edge, Station } from "./models";
import { EdgeInstance } from "./models/edge";
import { StationInstance } from "./models/station";

export interface ConductorArrival {
   arrivalTime: number;
   arrivalChance: number;
}

export interface StationWithArrivalInfo extends StationInstance {
   arrivals: ConductorArrival[];
}

export class ConductorUtil {

   public static async getConductorArrivalInfo(stations: { id: string }[] | string[]):
      Promise<{ [id: string]: StationWithArrivalInfo }> {

      const stationIds: string[] = [];
      for (const station of stations) {
         stationIds.push(typeof station === "string"
            ? station
            : station.id);
      }

      const arrivalInfo: { [stationId: string]: ConductorArrival[] } = {};
      const stationMap: { [id: string]: StationInstance } = {};

      const sourceStationMap: { [id: string]: StationInstance } = {};

      const stationsAndEdges: [StationInstance[], EdgeInstance[]] = await Promise.all([
         Station.findAll({ where: { id: { [sequelize.Op.in]: stationIds } } }),
         Edge.findAll({ where: { toStationId: { [sequelize.Op.in]: stationIds } } }),
      ]);
      const allStations: StationInstance[] = stationsAndEdges[0];
      const allEdges: EdgeInstance[] = stationsAndEdges[1];

      for (const station of allStations) {
         stationMap[station.id] = station;
      }
      const ids: string[] = _.uniq(
         allEdges.map((edge: EdgeInstance): string => edge.fromStationId));

      const result: StationInstance[] = await Station.findAll({ where: { id: { [sequelize.Op.in]: ids } } });

      for (const station of result) {
         sourceStationMap[station.id] = station;
      }

      /** The max time ago that a conductor arrival is assumed to be relevant */
      const timeDeltaLimitMs: number = 60 * 60 * 1000;
      // const timeDeltaLimitMs: number = Infinity;
      const currentTime: number = new Date().getTime();
      for (const edge of allEdges) {
        const conductorAt: number = Number(sourceStationMap[edge.fromStationId].conductorAt);
        const conductorWithPoliceAt: number = Number(sourceStationMap[edge.fromStationId].conductorWithPoliceAt);
        const conductorAtNextStop: number = Math.max(conductorAt, conductorWithPoliceAt) + edge.travelTimeMs;

        if (currentTime - conductorAtNextStop > timeDeltaLimitMs) {
          continue;
        }
        arrivalInfo[edge.toStationId] = arrivalInfo[edge.toStationId] || [];
        arrivalInfo[edge.toStationId].push({
          arrivalChance: edge.chance,
          arrivalTime: conductorAtNextStop,
        });
      }

      const stationsWithInfo: { [id: string]: StationWithArrivalInfo } = {};
      for (const stationId in stationMap) {
         stationsWithInfo[stationId] = _.extend(stationMap[stationId], {
            arrivals: arrivalInfo[stationId] || [],
         });
      }
      return stationsWithInfo;
   }
}
