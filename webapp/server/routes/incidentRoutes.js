const express = require("express");
const {
  createIncident,
  getIncidents,
  upvoteIncident,
} = require("../controllers/incidentController");

const router = express.Router();

router.post("/", createIncident);
router.get("/", getIncidents);
router.patch("/:id/upvote", upvoteIncident);

module.exports = router;
