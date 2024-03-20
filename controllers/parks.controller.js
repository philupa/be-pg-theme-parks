const { fetchParks, fetchRide, insertRide, updateRide, removeRide, fetchOnePark } = require("../models/parks.model");

exports.healthcheck = (req, res) => {
  res.status(200).send();
};

exports.getParks = (req, res) => {
  fetchParks().then((parks) => {
    res.status(200).send({ parks });
  });
};

exports.getRide = (req, res) => {
  const { ride_id } = req.params;
  fetchRide(ride_id).then((ride) => {
    res.status(200).send({ ride });
  });
};

exports.postRide = (req, res) => {
  const ride_obj = req.body;
  const { park_id } = req.params;
  insertRide(park_id, ride_obj).then((ride) => {
    res.status(201).send({ ride });
  });
};

exports.patchRide = (req, res) => {
  const ride_obj = req.body;
  const { ride_id } = req.params;
  updateRide(ride_id, ride_obj).then((ride) => {
    res.status(200).send({ ride });
  });
};

exports.deleteRide = (req, res) => {
  const {ride_id} = req.params
  removeRide(ride_id).then(() => {
    res.status(204).send()
  })
}

exports.getPark = (req,res) => {
  const {park_id} = req.params
  fetchOnePark(park_id).then((park) => {
    res.status(200).send({park})
  })
}