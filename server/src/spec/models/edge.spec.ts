import { Op } from "sequelize";
import { Edge, Station } from "../../main/models";
import { EdgeAttributes, EdgeInstance } from "../../main/models/edge";
import { StationAttributes, StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Edge model", (): void => {
   it("can be created and destroyed", (done: DoneFn): void => {
      let edge: EdgeInstance;

      Testbed.createEdge(Testbed.stations[0],
         Testbed.stations[1],
      ).then((result: EdgeInstance): Promise<void> => {
         SpecUtil.verifyInstance(result, Testbed.lastAttributes);
         edge = result;
         return result.destroy();
      }).then((): Promise<EdgeInstance> => {
         return Edge.findById(edge.id);
      }).then((result: EdgeInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done);
   });
});
