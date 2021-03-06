import * as bodyParser from "body-parser";
import * as debug from "debug";
import * as express from "express";
import * as path from "path";
import routes from "./controllers/routes";
import stations from "./controllers/stations";
import { Log } from "./Log";

Log.SERVER("Initializing...");

const app: express.Express = express();
app.use(bodyParser.json());

const apiRouter: express.Router = express.Router();
apiRouter.use("/stations", stations);
apiRouter.use("/routes", routes);
app.use("/api", apiRouter);

app.use(express.static(path.join(__dirname, "../../../client/dist")));
app.get("*", (req: express.Request, res: express.Response) => {
   res.sendFile(path.join(__dirname, "../../../client/dist/index.html"));
});

export default app;
