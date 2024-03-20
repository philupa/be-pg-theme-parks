const db = require("../db/connection");

exports.fetchParks = () => {
  return db.query(`SELECT * FROM parks;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchRide = (ride_id) => {
  return db.query(`SELECT * FROM rides WHERE ride_id = $1`, [ride_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.insertRide = (park_id, ride_obj) => {
  const { ride_name, year_opened } = ride_obj;
  return db
    .query(
      `INSERT INTO rides (park_id, ride_name, year_opened, votes) VALUES ($1, $2, $3, 0) RETURNING *;`,
      [park_id, ride_name, year_opened]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateRide = (ride_id, ride_obj) => {
  const { ride_name } = ride_obj;
  return db
    .query(`UPDATE rides SET ride_name = $1 WHERE ride_id = $2 RETURNING *;`, [ride_name, ride_id])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeRide = (ride_id) => {
  return db.query(`DELETE FROM rides WHERE ride_id = $1;`, [ride_id])
}

exports.fetchOnePark = (park_id) => {
  return db.query(`SELECT
  parks.park_id,
  parks.park_name,
  parks.year_opened,
  parks.annual_attendance,
  ROUND(AVG (rides.votes), 2)::FLOAT AS average_votes,
  COUNT(rides.ride_id)::INT AS ride_count
FROM
  parks
JOIN
  rides ON parks.park_id = rides.park_id
WHERE
  parks.park_id = $1
GROUP BY
  parks.park_id,
  parks.park_name,
  parks.year_opened,
  parks.annual_attendance
  ;`, [park_id])
  .then(({ rows }) => {
    console.log(rows)
    return rows[0]
  })
}