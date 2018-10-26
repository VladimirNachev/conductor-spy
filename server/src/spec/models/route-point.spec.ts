import { RoutePoint } from "../../main/models";
import { RoutePointInstance } from "../../main/models/route-point";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The RoutePoint model", (): void => {
   it("can be created and destroyed", async () => {
      const routePoint: RoutePointInstance = await
         Testbed.createRoutePoint(Testbed.routes[0], Testbed.stations[0]);

      SpecUtil.verifyInstance(routePoint, Testbed.lastAttributes);
      await routePoint.destroy();

      expect(await RoutePoint.findById(routePoint.id)).toBeFalsy();
   });
});
