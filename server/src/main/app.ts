import * as bodyParser from "body-parser";
import * as debug from "debug";
import * as express from "express";
import stations from "./controllers/stations";
import { Log } from "./Log";

Log.SERVER("Initializing...");

const app: express.Express = express();
app.use(bodyParser.json());

app.use("/", stations);

export default app;
