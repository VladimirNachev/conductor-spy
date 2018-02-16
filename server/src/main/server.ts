import app from "./app";
import { Log } from "./Log";
import { ConductorArrival } from './models';
import * as sequelize from "sequelize";
import { ConductorArrivalInstance } from "./models/conductor-arrival";

Log.DB("Serverrrrrrrrrrrrrrrrrrrrrr");

// const oneDayMs: number = 24 * 60 * 60 * 1000;
// setInterval((): void => {
//    Log.DB("Clearing old conductor arrival records...");
//    ConductorArrival.destroy({
//       where: {
//          arrivalTime: { [sequelize.Op.lt]: new Date().getTime() - oneDayMs }
//       },
//    }).then((): void => {
//       Log.DB("Done clearing old conductor arrival records");
//    });
// }, oneDayMs);


app.listen(3000, () => console.log("Started listening on port 3000."));
