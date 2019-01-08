process.env.NODE_ENV = "test";

import { Testbed } from "../Testbed";

beforeEach(async () => {
   await Testbed.clear();
   await Promise.all([
      Testbed.createRoute(),
      Testbed.createStation(),
      Testbed.createStation(),
   ]);
   expect(Testbed.stations.length).toBe(2);
   expect(Testbed.routes.length).toBe(1);
   await Promise.all([
      Testbed.createEdge(Testbed.stations[0], Testbed.stations[1]),
      Testbed.createRoutePoint(Testbed.routes[0], Testbed.stations[0]),
   ]);
});
