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
      const routePointAttributes: RoutePointAttributes = {
         index: 18,
         isReversed: false,
         routeId: Testbed.routes[0].id,
         stationId: Testbed.stations[0].id,
      };

      Log.DB("routePointAttributes.station.id =", routePointAttributes.stationId);

      RoutePoint.create(routePointAttributes).then((result: RoutePointInstance): Promise<void> => {
         expect(result).toBeTruthy();
         SpecUtil.verifyInstance(result, routePointAttributes);
         routePoint = result;
         return result.destroy();
      }).then((): Promise<RoutePointInstance> => {
         return RoutePoint.findById(routePoint.id);
      }).then((result: RoutePointInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });
});
