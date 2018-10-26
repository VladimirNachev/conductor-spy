import * as _ from "lodash";
import * as sequelize from "sequelize";
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

   public static async getConductorArrivalInfo(stations: { id: number }[] | number[]):
      Promise<{ [id: number]: StationWithArrivalInfo }> {

      const stationIds: number[] = [];
      for (const station of stations) {
         stationIds.push(typeof station === "number"
            ? station
            : station.id);
      }

      const arrivalInfo: { [stationId: number]: ConductorArrival[] } = {};
      const stationMap: { [id: number]: StationInstance } = {};

      const sourceStationMap: { [id: number]: StationInstance } = {};

      const stationsAndEdges: [StationInstance[], EdgeInstance[]] = await Promise.all([
         Station.findAll({ where: { id: { [sequelize.Op.in]: stationIds } } }),
         Edge.findAll({ where: { toStationId: { [sequelize.Op.in]: stationIds } } }),
      ]);
      const allStations: StationInstance[] = stationsAndEdges[0];
      const allEdges: EdgeInstance[] = stationsAndEdges[1];

      for (const station of allStations) {
         stationMap[station.id] = station;
      }
      const ids: number[] = _.uniq(
         allEdges.map((edge: EdgeInstance): number => edge.fromStationId));

      const result: StationInstance[] = await Station.findAll({ where: { id: { [sequelize.Op.in]: ids } } });

      for (const station of result) {
         sourceStationMap[station.id] = station;
      }

      /** The max time ago that a conductor arrival is assumed to be relevant */
      const timeDeltaLimitMs: number = 60 * 60 * 1000;
      // const timeDeltaLimitMs: number = Infinity;
      const currentTime: number = new Date().getTime();
      for (const edge of allEdges) {
         const conductorAt: number =
            parseInt(sourceStationMap[edge.fromStationId].conductorAt, 10) +
            edge.travelTimeMs;
         if (currentTime - conductorAt > timeDeltaLimitMs) {
            continue;
         }
         arrivalInfo[edge.toStationId] = arrivalInfo[edge.toStationId] || [];
         arrivalInfo[edge.toStationId].push({
            arrivalChance: edge.chance,
            arrivalTime: conductorAt,
         });
      }

      const stationsWithInfo: { [id: number]: StationWithArrivalInfo } = {};
      for (const stationId in stationMap) {
         stationsWithInfo[stationId] = _.extend(stationMap[stationId], {
            arrivals: arrivalInfo[stationId] || [],
         });
      }
      return stationsWithInfo;
   }
}
