const express = require("express");
const app = express();
const {
  healthcheck,
  getParks,
  getRide,
  postRide,
  patchRide,
  deleteRide,
  getPark
} = require("./controllers/parks.controller");

app.use(express.json());

app.get("/api/healthcheck", healthcheck);

app.get("/api/parks", getParks);

app.get("/api/ride/:ride_id", getRide);

app.post("/api/parks/:park_id/rides", postRide);

app.patch("/api/rides/:ride_id", patchRide);

app.delete("/api/rides/:ride_id", deleteRide)

app.get("/api/park/:park_id", getPark)

module.exports = app;
