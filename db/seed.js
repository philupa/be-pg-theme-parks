const db = require("./connection");
const format = require("pg-format");
const { prepareData, prepareRideData } = require("./utils/prepareData");

const parks = require("./data/parks");
const rides = require("./data/rides");
const stalls = require("./data/stalls");

function seed({ parks, rides, stalls }) {
  return db
    .query("DROP TABLE IF EXISTS rides;")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS stalls_foods;");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS parks;");
    })
    .then(() => {
      return createParks();
    })
    .then(() => {
      return createRides();
    })
    .then(() => {
      return insertParks(parks);
    })
    .then((parkResults) => {
      return insertRides(rides, parkResults);
    });
}

function createParks() {
  return db.query(
    `CREATE TABLE parks (
      park_id SERIAL PRIMARY KEY,
      park_name VARCHAR(255) NOT NULL,
      year_opened INT NOT NULL,
      annual_attendance INT NOT NULL);`
  );
}

function createRides() {
  return db.query(
    `CREATE TABLE rides (
      ride_id SERIAL PRIMARY KEY,
      park_id INT REFERENCES parks(park_id),
      ride_name VARCHAR(255) NOT NULL,
      year_opened INT NOT NULL,
      votes INT NOT NULL);`
  );
}

function insertParks(parks) {
  const formatedParks = prepareData(parks);

  const insertParksQueryString = format(
    `INSERT INTO parks
  (park_name, year_opened, annual_attendance)
  VALUES
  %L
  RETURNING *;`,
    formatedParks
  );

  return db.query(insertParksQueryString).then((parkResults) => {
    return parkResults.rows;
  });
}

function insertRides(rides, parkResults) {
  const formatedRides = prepareRideData(rides, parkResults);

  const insertRidesQueryString = format(
    `INSERT INTO rides
  (park_id, ride_name, year_opened, votes)
  VALUES
  %L
  RETURNING *;`,
    formatedRides
  );

  return db.query(insertRidesQueryString).then((ridesResults) => {
    return ridesResults.rows;
  });
}

module.exports = seed;
