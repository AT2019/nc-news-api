const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router.js");
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Page not found" });
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).send({ msg: err.msg });
});

module.exports = app;
