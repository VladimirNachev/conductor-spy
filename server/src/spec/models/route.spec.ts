import { Op } from "sequelize";
import { Route } from "../../main/models";
import { RouteAttributes, RouteInstance } from "../../main/models/route";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Route model", (): void => {
   it("can be created and destroyed", (done: DoneFn): void => {
      let route: RouteInstance;

      Testbed.createRoute().then((result: RouteInstance): Promise<void> => {
         SpecUtil.verifyInstance(result, Testbed.lastAttributes);
         route = result;
         return result.destroy();
      }).then((): Promise<RouteInstance> => {
         return Route.findById(route.id);
      }).then((result: RouteInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done);
   });
});
