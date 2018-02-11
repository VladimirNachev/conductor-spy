process.env.NODE_ENV = "test";

import { Promise } from "bluebird";
import { Log } from "../../main/Log";
import { Testbed } from "../Testbed";

beforeEach((done: DoneFn): void => {
   Log.DB("Creating...");
   Promise.all([
      Testbed.createRoute(),
      Testbed.createStation(),
      Testbed.createStation(),
   ]).then((): Promise<any> => {
      expect(Testbed.stations.length).toBe(2);
      expect(Testbed.routes.length).toBe(1);
      return Promise.all([
         Testbed.createEdge(Testbed.stations[0], Testbed.stations[1]),
      ]);
   }).then(done).catch(done.fail);
});

afterEach((done: DoneFn): void => {
   Log.DB("Destroying...");
   Testbed.destroyAll().then(done).catch(done.fail);
});
