import { Op } from "sequelize";
import { Log } from "../../main/Log";
import { Edge, Station } from "../../main/models";
import { EdgeAttributes, EdgeInstance } from "../../main/models/edge";
import { StationAttributes, StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Station model", (): void => {
   it("can be created and destroyed", (done: DoneFn): void => {
      let station: StationInstance;

      Testbed.createStation().then((result: StationInstance): Promise<void> => {
         SpecUtil.verifyInstance(result, Testbed.lastAttributes);
         station = result;
         return result.destroy();
      }).then((): Promise<StationInstance> => {
         return Station.findById(station.id);
      }).then((result: StationInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });

   it("does not allow duplicate station numbers", (done: DoneFn): void => {
      Testbed.createStation().then((result: StationInstance): Promise<StationInstance> => {
         return Testbed.createStation({ stationNumber: result.stationNumber });
      }).then((): void => {
         done.fail("The creation of the station with the same number should have failed");
      }).catch(done);
   });
});
