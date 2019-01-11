import * as request from "supertest";
import app from "../../main/app";
import { ConductorArrival } from "../../main/conductor.util";
import { RouteInstance } from "../../main/models/route";
import { RoutePointInstance } from "../../main/models/route-point";
import { StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

interface StationArrivalInfo {
   id: number;
   index: number;
   subrouteIndex: number;
   stationName: string;
   arrivals: ConductorArrival[];
}

describe("The Route controller", () => {
   it("can get all routes", async () => {
      await Testbed.clear();
      await Testbed.createRoute();
      await Testbed.createRoute();
      await Testbed.createRoute();
      const rawResult: any = await request(app)
         .get("/api/routes")
         .expect(200);
      const result: any[] = JSON.parse(rawResult.text);

      expect(result.length).toBe(3);
      SpecUtil.verifyInstance(result[0], Testbed.routeAttributes[0]);
      SpecUtil.verifyInstance(result[1], Testbed.routeAttributes[1]);
      SpecUtil.verifyInstance(result[2], Testbed.routeAttributes[2]);
   });

   it("can get a route by ID", async () => {
      const rawResult: any = await request(app)
         .get(`/api/routes/${Testbed.routes[0].id}`)
         .expect(200);
      SpecUtil.verifyInstance(JSON.parse(rawResult.text), Testbed.routeAttributes[0]);
   });

   describe("WHEN a route does not exist", () => {
      it("should return 404", async () => {
         await Testbed.clear();
         const rawResult: any = await request(app)
            .get(`/api/routes/0`)
            .expect(404);
         expect(rawResult.text).toBe("");
      });
   });

   it("can get the points of a route by ID, along with arrival info", async () => {
      await Testbed.clear();
      const now: number = new Date().getTime();
      const stations: StationInstance[] = await Promise.all([
         Testbed.createStation({ name: "station0", conductorAt: now - 150 }),
         Testbed.createStation({ name: "station1", conductorAt: now - 15050 }),
         Testbed.createStation({ name: "station2", conductorAt: 0 }),
         Testbed.createStation({ name: "station3", conductorAt: now - 140 }),
         Testbed.createStation({ name: "station4", conductorAt: now - 0 }),
      ]);

      const route: RouteInstance = await Testbed.createRoute();
      const routePoints: RoutePointInstance[] = await Promise.all([
         // Forwards (2 -> 3 -> 4)
         Testbed.createRoutePoint(route, stations[2], { index: 0, subrouteIndex: 0 }),
         Testbed.createRoutePoint(route, stations[3], { index: 1, subrouteIndex: 0 }),
         Testbed.createRoutePoint(route, stations[4], { index: 2, subrouteIndex: 0 }),
         // Backwards (4 -> 2)
         // NOTE: In real life, the backward station numbers are usually different than the forward ones
         Testbed.createRoutePoint(route, stations[4], { index: 0, subrouteIndex: 1 }),
         Testbed.createRoutePoint(route, stations[2], { index: 1, subrouteIndex: 1 }),
      ]);

      await Promise.all([
         // To station2
         Testbed.createEdge(stations[0], stations[2], {
            chance: 0.1,
            travelTimeMs: 25000,
         }),
         Testbed.createEdge(stations[1], stations[2], {
            chance: 0.2,
            travelTimeMs: 1000,
         }),
         // To station3
         Testbed.createEdge(stations[0], stations[3], {
            chance: 0.3,
            travelTimeMs: 2500,
         }),
         // To station4
         Testbed.createEdge(stations[1], stations[4], {
            chance: 0.5,
            travelTimeMs: 10,
         }),
         Testbed.createEdge(stations[3], stations[4], {
            chance: 0.6,
            travelTimeMs: 1000000,
         }),
         // station2 hasn't had a conductor for a long time so its edges don't do anything
         Testbed.createEdge(stations[2], stations[2], { chance: 1.0 }),
         Testbed.createEdge(stations[2], stations[3], { chance: 1.0 }),
         Testbed.createEdge(stations[2], stations[4], { chance: 1.0 }),
      ]);

      const rawResult: any = await request(app)
         .get(`/api/routes/${route.id}/points`)
         .expect(200);
      const result: StationArrivalInfo[] = JSON.parse(rawResult.text);
      for (const arrivalInfo of result) {
         arrivalInfo.arrivals.sort((a: ConductorArrival, b: ConductorArrival) =>
            a.arrivalChance - b.arrivalChance);
      }
      const station2ArrivalInfo: ConductorArrival[] = [
         { arrivalChance: 0.1, arrivalTime: now - 150 + 25000 },
         { arrivalChance: 0.2, arrivalTime: now - 15050 + 1000 },
      ];
      const station3ArrivalInfo: ConductorArrival[] = [
         { arrivalChance: 0.3, arrivalTime: now - 150 + 2500 },
      ];
      const station4ArrivalInfo: ConductorArrival[] = [
         { arrivalChance: 0.5, arrivalTime: now - 15050 + 10 },
         { arrivalChance: 0.6, arrivalTime: now - 140 + 1000000 },
      ];
      expect(result).toEqual([
         {
            id: routePoints[0].id,
            index: routePoints[0].index,
            arrivals: station2ArrivalInfo,
            stationName: stations[2].name,
            subrouteIndex: routePoints[0].subrouteIndex,
         },
         {
            id: routePoints[1].id,
            index: routePoints[1].index,
            arrivals: station3ArrivalInfo,
            stationName: stations[3].name,
            subrouteIndex: routePoints[1].subrouteIndex,
         },
         {
            id: routePoints[2].id,
            index: routePoints[2].index,
            arrivals: station4ArrivalInfo,
            stationName: stations[4].name,
            subrouteIndex: routePoints[2].subrouteIndex,
         },
         {
            id: routePoints[3].id,
            index: routePoints[3].index,
            arrivals: station4ArrivalInfo,
            stationName: stations[4].name,
            subrouteIndex: routePoints[3].subrouteIndex,
         },
         {
            id: routePoints[4].id,
            index: routePoints[4].index,
            arrivals: station2ArrivalInfo,
            stationName: stations[2].name,
            subrouteIndex: routePoints[4].subrouteIndex,
         },
      ]);
   });
});
