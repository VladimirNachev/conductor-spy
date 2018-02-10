import { Op } from "sequelize";
import { Edge, Station } from "../../main/models";
import { EdgeAttributes, EdgeInstance } from "../../main/models/edge";
import { StationInstance } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";

interface SS {
   edgeAttributes: EdgeAttributes;
   edge: EdgeInstance;
   station: StationInstance;
   station2: StationInstance;
}

describe("The Edge model", (): void => {
   beforeEach(function (this: SS, done: DoneFn): void {
      Station.bulkCreate(
         [{}, {}],
         { returning: true },
      ).then((stations: StationInstance[]): void => {
         [this.station, this.station2] = [stations[0], stations[1]];
         expect(this.station.id).toBeTruthy();
         expect(this.station2.id).toBeTruthy();
      }).then(done).catch(done.fail);
   });

   it("can be created and destroyed", function (this: SS, done: DoneFn): void {
      this.edgeAttributes = {
         chance: 0.4,
         fromStationId: this.station.id,
         toStationId: this.station2.id,
         travelTimeMs: 12052,
      };

      Edge.create(this.edgeAttributes).then((result: EdgeInstance): Promise<void> => {
         expect(result).toBeTruthy();
         SpecUtil.verifyInstance(result, this.edgeAttributes);
         this.edge = result;
         return result.destroy();
      }).then((): Promise<EdgeInstance> => {
         return Edge.findById((this.edge as any).id);
      }).then((result: EdgeInstance): void => {
         expect(result).toBeFalsy();
      }).then(done).catch(done.fail);
   });

   afterEach(function (this: SS, done: DoneFn): void {
      SpecUtil.destroy(this.station, this.station2).then(done).catch(done.fail);
   });
});
