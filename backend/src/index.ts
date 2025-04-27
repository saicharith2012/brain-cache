import app from "./app.js";
import { Config } from "./config.js";
import connectDB from "./db/db.js";

connectDB()
  .then(() => {
    app.listen(Config.port || 3000, () => {
      console.log(`Server listening at port ${Config.port}...`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection FAILED!", error);
  });
