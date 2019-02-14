import * as request from "supertest";
import app from "../../main/app";
import { StationAttributes } from "../../main/models/station";
import { SpecUtil } from "../SpecUtil";
import { Testbed } from "../Testbed";

describe("The Station controller", () => {
  it("can get all stations", async () => {
    await Testbed.clear();

    await Testbed.createStation();
    await Testbed.createStation();
    await Testbed.createStation();

    const rawResult: any = await request(app)
      .get("/api/stations?longtitude=1.519&latitude=1.119")
      .expect(200);

    const result: any[] = rawResult.body;

    expect(result.length).toBe(3);
    expect(result[0].name).toEqual(Testbed.stations[0].name);
    expect(result[1].name).toEqual(Testbed.stations[1].name);
    expect(result[2].name).toEqual(Testbed.stations[2].name);
  });

  it("can get a station by ID", async () => {
    const rawResult: any = await request(app)
      .get(`/api/stations/${Testbed.stations[0].id}`)
      .expect(200);

    const result: any = rawResult.body;

    SpecUtil.verifyInstance(result, Testbed.stationAttributes[0]);
  });

  it("can not get a station by non-existent ID", async () => {
    const rawResult: any = await request(app)
      .get(`/api/stations/-1`)
      .expect(404);
  });

  it("can update station by ID", async () => {
    const updatedStation: StationAttributes = { name: "New name" };
    const rawResult: any = await request(app)
      .put(`/api/stations/${Testbed.stations[0].id}`)
      .send(updatedStation)
      .expect(200);

    const result: StationAttributes = rawResult.body;

    expect(result.name).toEqual(updatedStation.name);
  });

  it("can not update station by non-existent ID", async() => {
    const updatedStation: StationAttributes = { name: "New name" };
    const rawResult: any = await request(app)
      .put(`/api/stations/-1`)
      .send(updatedStation)
      .expect(404);
  });
});
