process.env.NODE_ENV = "test";

import { Promise } from "bluebird";
import { Log } from "../../main/Log";
import { Testbed } from "../Testbed";

beforeEach((done: DoneFn): void => {
   Promise.all([
      Testbed.createRoute(),
      Testbed.createStation(),
      Testbed.createStation(),
   ]).then((): Promise<any> => {
      expect(Testbed.stations.length).toBe(2);
      expect(Testbed.routes.length).toBe(1);
      return Promise.all([
         Testbed.createEdge(Testbed.stations[0], Testbed.stations[1]),
         Testbed.createRoutePoint(Testbed.routes[0], Testbed.stations[0]),
      ]);
   }).then(done).catch(done);
});

afterEach((done: DoneFn): void => {
   Testbed.destroyAll().then(done).catch(done);
});
