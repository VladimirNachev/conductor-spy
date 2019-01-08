import * as request from "supertest";
import app from "../../main/app";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Route controller", () => {
   it("can get all routes", async () => {
      await Testbed.clear();
      const route: any = await Testbed.createRoute();
      const rawResult: any = await request(app)
         .get("/api/routes")
         .expect(200);
      const result: any[] = JSON.parse(rawResult.text);

      expect(result.length).toBe(1);
      SpecUtil.verifyRawInstance(result[0], Testbed.lastAttributes);
      await route.destroy();
   });
});
