function prepareData(parks) {
  return parks.map((park) => {
    let newArray = [];
    //return [park.park_name, park.year_opened, park.annual_attendance];
    for (key in park) {
      newArray.push(park[key]);
    }
    return newArray;
  });
}

function prepareRideData(rides, parkResults) {
  return rides.map((ride) => {
    const parkOfRide = parkResults.find((park) => {
      return ride.park_name === park.park_name;
    });
    return [parkOfRide.park_id, ride.ride_name, ride.year_opened, ride.votes];
  });
}

module.exports = { prepareData, prepareRideData };
