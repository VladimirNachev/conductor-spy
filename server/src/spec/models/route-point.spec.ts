import { Op } from "sequelize";
import { Log } from "../../main/Log";
import { Route, RoutePoint, Station } from "../../main/models";
import { RouteAttributes, RouteInstance } from "../../main/models/route";
import { RoutePointAttributes, RoutePointInstance } from "../../main/models/route-point";
import { StationAttributes, StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The RoutePoint model", (): void => {
   it("can be created and destroyed", (done: DoneFn): void => {
      let routePoint: RoutePointInstance;

      Testbed.createRoutePoint(
         Testbed.routes[0],
         Testbed.stations[0],
      ).then((result: RoutePointInstance): Promise<void> => {
         SpecUtil.verifyInstance(result, Testbed.lastAttributes);
         routePoint = result;
         return result.destroy();
      }).then((): Promise<RoutePointInstance> => {
         return RoutePoint.findById(routePoint.id);
      }).then((result: RoutePointInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });
});
