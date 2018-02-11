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
      const stationAttributes: StationAttributes = {
         name: "asd",
         conductorAt: 1800,
         longtitude: 5.235,
         latitude: 12.12,
      };

      Station.create(stationAttributes).then((result: StationInstance): Promise<void> => {
         station = result;
         return result.destroy();
      }).then((): Promise<StationInstance> => {
         return Station.findById(station.id);
      }).then((result: StationInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });
});
