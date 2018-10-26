import { Edge } from "../../main/models";
import { EdgeInstance } from "../../main/models/edge";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Edge model", (): void => {
   it("can be created and destroyed", async () => {
      const edge: EdgeInstance = await
         Testbed.createEdge(Testbed.stations[0], Testbed.stations[1]);

      SpecUtil.verifyInstance(edge, Testbed.lastAttributes);
      await edge.destroy();

      expect(await Edge.findById(edge.id)).toBeFalsy();
   });
});
