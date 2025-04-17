import app from "./app.js";
import { PORT } from "./config.js";
import connectDB from "./db/db.js";

connectDB()
  .then(() => {
    app.listen(PORT || 3000, () => {
      console.log(`Server listening at port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection FAILED!", error);
  });
