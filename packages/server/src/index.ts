import find from "find-up";
import dotenv from "dotenv";
import createHttpServer from "./server";

const envPath = find.sync(".env");
dotenv.config({ path: envPath });

const port = process.env.PORT || 8080;
createHttpServer().then((server) => {
  server.listen(port, () => {
    console.log(`Listening on port ${port} 📡`);
  });
});
