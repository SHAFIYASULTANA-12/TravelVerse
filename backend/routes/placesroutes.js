const express = require("express");

const router = express.Router();

const { getPlaces } = require("../controllers/placescontroller");

router.get("/", getPlaces);

module.exports = router;