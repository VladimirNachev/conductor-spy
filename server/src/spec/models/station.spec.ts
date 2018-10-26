import { Station } from "../../main/models";
import { StationAttributes, StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Station model", (): void => {
   it("can be created and destroyed", async () => {
      const station: StationInstance = await Testbed.createStation();
      SpecUtil.verifyInstance(station, Testbed.lastAttributes);
      await station.destroy();

      expect(await Station.findById(station.id)).toBeFalsy();
   });

   it("does not allow duplicate station numbers", async () => {
      const firstStation: StationInstance =
         await Testbed.createStation();

      let cannotCreateStation: boolean = false;
      await Testbed.createStation({ stationNumber: firstStation.stationNumber })
         .catch(() => { cannotCreateStation = true; });
      expect(cannotCreateStation).toBe(true);
   });
});
