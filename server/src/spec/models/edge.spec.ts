import { Op } from "sequelize";
import { Edge, Station } from "../../main/models";
import { EdgeAttributes, EdgeInstance } from "../../main/models/edge";
import { StationAttributes, StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Edge model", (): void => {
   it("can be created and destroyed", (done: DoneFn): void => {
      let edge: EdgeInstance;
      const edgeAttributes: EdgeAttributes = {
         travelTimeMs: 1800,
         fromStationId: Testbed.stations[0].id,
         toStationId: Testbed.stations[1].id,
         chance: 0.5,
      };

      Edge.create(edgeAttributes).then((result: EdgeInstance): Promise<void> => {
         expect(result).toBeTruthy();
         SpecUtil.verifyInstance(result, edgeAttributes);
         edge = result;
         return result.destroy();
      }).then((): Promise<EdgeInstance> => {
         return Edge.findById(edge.id);
      }).then((result: EdgeInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });
});
