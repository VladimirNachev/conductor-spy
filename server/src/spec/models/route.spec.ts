import { Route } from "../../main/models";
import { RouteInstance } from "../../main/models/route";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Route model", (): void => {
   it("can be created and destroyed", async () => {
      const route: RouteInstance = await Testbed.createRoute();
      SpecUtil.verifyInstance(route, Testbed.lastAttributes);
      await route.destroy();

      expect(await Route.findById(route.id)).toBeFalsy();
   });
});
