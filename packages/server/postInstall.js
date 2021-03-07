const fs = require("fs");
require("dotenv").config();

if (process.env.FIREBASE_CONFIG_JSON !== undefined) {
  fs.writeFile(
    "./service_account.json",
    process.env.FIREBASE_CONFIG_JSON,
    (err) => {
      console.log("Credentials written");
    }
  );
}
