import { Op } from "sequelize";
import { Route } from "../../main/models";
import { RouteAttributes, RouteInstance } from "../../main/models/route";
import { SpecUtil } from "../SpecUtil";

describe("The Route model", (): void => {
   it("can be created and destroyed", (done: DoneFn): void => {
      const routeAttributes: RouteAttributes = {
         routeNumber: 1,
         vehicleType: "bus",
      };

      let route: RouteInstance;

      Route.create(routeAttributes).then((result: RouteInstance): Promise<void> => {
         expect(result).toBeTruthy();
         SpecUtil.verifyInstance(result, routeAttributes);
         route = result;
         return result.destroy();
      }).then((): Promise<RouteInstance> => {
         return Route.findById((route as any).id);
      }).then((result: RouteInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });
});
