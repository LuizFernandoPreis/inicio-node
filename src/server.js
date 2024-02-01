require("dotenv").config();
require("./database/index");
const express = require("express");
const routes = require("./routes");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT, () => {
  console.log("online");
});

app.get("/", (req, res) => {
  res.send("olá");
});
