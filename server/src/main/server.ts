import * as bodyParser from "body-parser";
import * as debug from "debug";
import * as express from "express";
import { Log } from "./Log";
import { Station } from "./models/index";

Log.SERVER("Initializing...");

export const app: express.Express = express();
app.use(bodyParser.json());

app.get("/", (req: express.Request, res: express.Response): void => {
   Log.APP("Request has come from IP " + req.ip);
   Station.create({});

   Station.count({ where: {} }).then((count: number): void => {
      res.status(200).send("Hello world. There are " + count + " stations.");
   }).catch((err: Error): void => {
      res.status(500).send(err.message);
   });
});

app.listen(3000, () => Log.SERVER("Started listening on port 3000."));
