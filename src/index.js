import app from "./app.js";
import config from "./config.js";
import { MongooseDB } from "./core/database/mongooseDB.js";

const PORT = config.PORT || 3000;

const start = performance.now();
app.listen(PORT, () => {
  console.log(`Server-startup → ${(performance.now() - start).toFixed(2)}.ms`);
  console.log(`Server on port ${PORT}`);
  MongooseDB();
});
