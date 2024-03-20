\c theme_parks

SELECT * FROM parks;
SELECT * FROM rides;
SELECT
  parks.park_name,
  parks.year_opened,
  parks.annual_attendance,
  ROUND(AVG(rides.votes), 2) AS average_votes,
  COUNT(rides.ride_id) AS ride_count
FROM
  parks
JOIN
  rides ON parks.park_id = rides.park_id
WHERE
  parks.park_id = 2
GROUP BY
  parks.park_name,
  parks.year_opened,
  parks.annual_attendance;