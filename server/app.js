const express = require("express");
const path = require("path");
const diceResultRoutes = require("./routes/dice-result.routes");

const app = express();

const { ROOT_PATH, NODE_ENV } = process.env;
const rootPath = ROOT_PATH || "/";
const isDevelopment = NODE_ENV && NODE_ENV.toLowerCase() === "development";
const bundleFolder = "../build/";

app.use(express.json());
app.use(express.static(path.join(__dirname, bundleFolder)));

if (isDevelopment) {
  app.use(function (req, res, next) {
    console.log(new Date().toISOString(), req.method, req.url, req.body);
    next();
  });
}

app.use(`${rootPath}dice-results`, diceResultRoutes);

app.use(function (error, req, res, next) {
  res.json({ message: error.message });
});

app.get(rootPath, (req, res) => {
  res.sendFile(path.join(__dirname, bundleFolder + "index.html"));
});

module.exports = app;
