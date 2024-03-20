const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection");

const seed = require("../db/seed");
const data = require("../db/data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

// GET /api/healthcheck
describe("GET /api/healthcheck", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/healthcheck").expect(200);
  });
});

// GET /api/parks
describe("GET /api/parks", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/parks").expect(200);
  });

  test("returns an array of park objects", () => {
    return request(app)
      .get("/api/parks")
      .then(({ body }) => {
        body.parks.forEach((park) => {
          expect(typeof park).toBe("object");
          expect(typeof park.park_name).toBe("string");
          expect(typeof park.year_opened).toBe("number");
          expect(typeof park.annual_attendance).toBe("number");
        });
        expect(Array.isArray(body.parks)).toBe(true);
        expect(body.parks).toHaveLength(4);
      });
  });
});

//GET /api/ride/:ride_id
describe("GET /api/ride/:ride_id", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/ride/2").expect(200);
  });
  test("should respond with a ride object with appropriate properties", () => {
    return request(app)
      .get("/api/ride/2")
      .then(({ body }) => {
        expect(body.ride.ride_id).toBe(2);
        expect(body.ride.ride_name).toBe("Stealth");
        expect(body.ride.year_opened).toBe(2006);
        expect(body.ride.park_id).toBe(1);
        expect(body.ride.votes).toBe(4);
      });
  });
});

//POST /api/parks/:park_id/rides
describe("POST /api/parks/:park_id/rides", () => {
  test("should respond with the newly posted ride object", () => {
    const actual = {
      ride: {
        ride_id: 21,
        ride_name: "new ride",
        year_opened: 2023,
        park_id: 1,
        votes: 0,
      },
    };
    return request(app)
      .post("/api/parks/1/rides")
      .send({ ride_name: "new ride", year_opened: 2023 })
      .expect(201)
      .then(({ body }) => {
        expect(body).toEqual(actual);
      });
  });
});

//PATCH /api/rides/:ride_id
describe("PATCH /api/rides/:ride_id", () => {
  test("should respond with newly patched ride object", () => {
    const actual = {
      ride: {
        ride_id: 1,
        ride_name: "new ride name",
        year_opened: 2002,
        park_id: 1,
        votes: 5,
      },
    };
    return request(app)
      .patch("/api/rides/1")
      .send({ ride_name: "new ride name" })
      .expect(200)
      .then(({ body }) => {
        const { ride_id, ride_name, year_opened, park_id, votes } = body.ride;
        expect(ride_id).toEqual(1);
        expect(ride_name).toEqual("new ride name");
        expect(year_opened).toEqual(2002);
        expect(park_id).toEqual(1);
        expect(votes).toEqual(5);
      });
  });
});

//DELETE /api/rides/:ride_id
describe('DELETE /api/rides/:ride_id', () => {
  test('should return with 204 status code and shorten the length of the rides table', () => {
    return request(app)
    .delete("/api/rides/1")
    .expect(204)

    .then(() => {
      db
      .query(`SELECT * FROM rides WHERE ride_id = 1;`)
      .then(({rows}) => {
        expect(rows).toBe(undefined)
      })
    })
    
    .then(() => {
      db
      .query(`SELECT * FROM rides;`)
      .then(({rows}) => {
        expect(rows.length).toBe(19)
      })
    })
    
  });
});

//GET /api/park/:park_id
describe.only("GET /api/park/:park_id", () => {
  test("returns 200 status code", () => {
    return request(app).get("/api/park/2").expect(200);
  });
  test("should respond with a ride object with appropriate properties", () => {
    return request(app)
      .get("/api/park/2")
      .then(({ body }) => {
        expect(body.park.park_id).toBe(2);
        expect(body.park.park_name).toBe("Alton Towers");
        expect(body.park.year_opened).toBe(1980);
        expect(body.park.annual_attendance).toBe(2520000);
        expect(body.park.average_votes).toBe(4.33);
        expect(body.park.ride_count).toBe(6);
      });
  });
});