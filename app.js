const express = require("express");
const cors = require("cors");
const app = express();
const apiRouter = require("./routes/api-router.js");
app.use(express.json());

app.use(cors());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  else next(err);
});

app.use((err, req, res, next) => {
  const psqlCodes = ["22P02"];
  const psqlCodes2 = ["23503"];
  if (psqlCodes.includes(err.code))
    res.status(400).send({ msg: "Bad request" });
  else if (psqlCodes2.includes(err.code))
    res.status(404).send({ msg: err.detail });
  else res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
