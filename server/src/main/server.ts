import app from "./app";
import { Log } from "./Log";

app.listen(3000, () => Log.SERVER("Started listening on port 3000."));
