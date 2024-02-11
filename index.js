const express = require("express");
const bodyParser = require("body-parser");
const netflix = require("./netflix");
const { v4: uuidv4 } = require("uuid");

const app = express();
const userId = uuidv4();
app.use(bodyParser.json());

/*app.use((req, res, next) => {
    req.headers["request_id"] = userId;
    console.log(userId)
    if (!req.headers.hasOwnProperty("user_id")) {
      res.status(400).send({ msg: "User Id Required" });
    } else {
      next();
    }
  });*/

app.use("/v1/", netflix);

app.listen(3000, console.log("Server Started"));