import * as express from "express";
import * as bodyParser from "body-parser";

const app: express.Express = express();

app.use(bodyParser.json())

app.get("/", (req: express.Request, res: express.Response): void => {
    res.status(200).send(JSON.parse("Hello world")).end();
});

app.listen(3000, () => console.log("Started listening on port 3000."));
