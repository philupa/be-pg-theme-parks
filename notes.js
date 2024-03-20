// Create an express server:
// app.js
const express = require("express");
const app = express();

app.get("/api", (res, req) => {
  res.status(200).send({ message: "hello northcoders" });
});
app.get("/api/snacks", getSnacks);
app.get("/api/snack/:snack_id", getSnacksById);
app.post("/api/snacks", postSnack);

module.exports = app;

// controllers/snacks.controller.js
const { fetchSnacks, fetchSnackById } = require("../controller....");
exports.getSnacks = (req, res) => {
  fetchSnacks().then((snacks) => {
    res.status(200).send({ snacks: snacks });
  });
};

exports.getSnackById = (req, res) => {
  const { snack_id } = req.params;
  fetchSnackById(snack_id).then((snack) => {
    res.status(200).send({ snack });
  });
};

exports.postSnack = (req, res, next) => {
  const { snack_name, price_in_pence, is_vegan } = req.body;
  createSnack(snack_name, price_in_pence, is_vegan).then((newSnack) => {
    res.status(201).send({ snack });
  });
};

// models/snacks.models.js
const db = require("../db/connection");

exports.fetchSnacks = () => {
  return db.query("SELECT * FROM snacks;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchSnackById = (id) => {
  return db.query(`SELECT * FROM snacks WHERE snack_id=$1;`, [id]).then(({ row }) => {
    return row[0];
  });
};

exports.createSnack = (snack_name, price_in_pence, is_vegan) => {
  return db
    .query(
      `INSERT INTO snacks 
  (snack_name, price_in_pence, is_vegan) 
  VALUE ($1, $2, $3)
  RETURNING *;`,
      [snack_name, price_in_pence, is_vegan]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
// PGDATABASE=db_name jest !! in package.json

// npm install -D supertest
// run the tests using jest; supertest is not invoked directly

// Integration tests:
const app = require("../app.js");
const request = require("supertest");
const db = require("..db/connection");

const seed = require("../db/seed");
const data = require("../db/data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

// testing the /api endpoint: GET request returns 200 and "hello northcoders" body
describe("GET /api", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api").expect(200);
  });
  test("returns correct message", () => {
    return request(app)
      .get("/api")
      .then((response) => {
        expect(response.body.message).toBe("hello northcoders");
      });
  });
});

// testing /api/snacks endpoint: GET returns 200 and response [{snack},{snack},{}..]
describe("GET /api/snacks", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/snacks").expect(200);
  });
  test("returns an array of snack objects", () => {
    return request(app)
      .get("/api/snacks")
      .then(({ body }) => {
        expect(body.snacks).toHaveLength(13);
        body.snacks.foEach((snack) => {
          expect(typeof snack.snack_id).toBe("number");
          expect(typeof snack.snack_name).toBe("string");
        });
      });
  });
});

// testing /api/snacks/:snack_id: GET returns 200 and a single snack object.
describe("GET /api/snack/:snack_id", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/snack/1").expect(200);
  });
  test("resoponds with correct object", () => {
    return request(app)
      .get("/api/snacks/1")
      .then(({ body }) => {
        expect(body.snack.snack_id).toBe(3);
        expect(body.snack.snack_name).toBe("party ring");
      });
  });
});

describe("POST /api/snacks", () => {
  test("respond with a newly posted snack", () => {
    const newSnack = {
      snack_name: "Doritos - Red Hot",
      price_in_pence: 60,
      is_vegan: true,
    };

    return request(app)
      .post("/api/snacks")
      .send(newSnack)
      .expect(201) // no separate test for status code!
      .then(({ body }) => {
        const { snack_id, snack_name, price_in_pence, is_vegan } = body.snack;
        expect(snack_id).toBe(14);
        expect(snack_name).toBe("Doritos - Red Hot");
        expect(price_in_pence).toBe(60);
        expect(is_vegan).toBe(true);
      });
  });
});
