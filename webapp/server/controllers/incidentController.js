/**
 * incidentController.js
 * ----------------------
 * Handles all CRUD operations and business logic for flood incident annotations.
 * Interfaces with the Incident Mongoose model to create, retrieve, update, delete, and upvote incident entries.
 *
 * - `createIncident`: Creates a new incident from form submission data, including image conversion and validation.
 * - `getIncidents`: Returns all incident records from the database.
 * - `getIncidentById`: Retrieves a single incident by its MongoDB ObjectId.
 * - `updateIncident`: Updates a specific incident with new data.
 * - `deleteIncident`: Removes an incident by ID.
 * - `upvoteIncident`: Increments or decrements the upvote count based on user interaction.
 *
 * Images are expected in base64 format and converted to binary buffers before storage.
 * `floodVisibility` and `imagePrivacy` fields are used to control public display.
 */

const Incident = require("../models/incidentModel");

/* Creates an incident from data from the user's annotation form */
const createIncident = async (req, res) => {
  try {
    const {
      description,
      dateOfIncident,
      latitude,
      longitude,
      images,
      waterDepth,
      waterCauses,
      floodSpread,
      floodLocation,
      floodAddress,
      waterCleanliness,
      floodTimeline,
      propertyType,
      floodVisibility,
      otherFloodCause,
      otherFloodLocation,
      emailAlderman,
      imagePrivacy
    } = req.body;

    console.log(images);
    // Convert the images into a format that MongoDB can handle (Base64 to buffer)
    const formattedImages = images
      .map((image) => {
        try {
          return {
            data: Buffer.from(image.data, "base64"),
            contentType: image.contentType,
          };
        } catch (error) {
          console.error("Error converting image:", error);
          return null;
        }
      })
      .filter(Boolean);
    console.log("Formatted Images:", formattedImages);

    // Create a new incident with the updated fields
    const newIncident = new Incident({
      description,
      dateOfIncident,
      latitude,
      longitude,
      images: formattedImages,
      upvotes: 0, // default value
      waterDepth,
      waterCauses,
      floodSpread,
      floodLocation,
      floodAddress,
      waterCleanliness,
      floodTimeline,
      propertyType,
      floodVisibility,
      otherFloodCause,
      otherFloodLocation,
      emailAlderman, // whether to email the alderman or not
      imagePrivacy
    });

    console.log("New Incident Data:", newIncident);

    // Save the incident to the database
    await newIncident.save();
    res.status(201).json(newIncident);
  } catch (err) {
    console.error("Error creating incident:", err);
    res.status(500).json({ error: "Failed to create incident." });
  }
};

/* Gets all recorded incident annotations */
const getIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json(incidents);
  } catch (err) {
    console.error("Error fetching incidents:", err);
    res.status(500).json({ error: "Failed to fetch incidents." });
  }
};

/* Gets a specific incident by ID */
const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;
    const incident = await Incident.findById(id);

    if (!incident) {
      return res.status(404).json({ error: "Incident not found." });
    }

    res.status(200).json(incident);
  } catch (err) {
    console.error("Error fetching incident by ID:", err);
    res.status(500).json({ error: "Failed to fetch incident." });
  }
};

/* Updates an incident by ID */
const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedIncident = await Incident.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the data before updating
    });

    if (!updatedIncident) {
      return res.status(404).json({ error: "Incident not found." });
    }

    res.status(200).json(updatedIncident);
  } catch (err) {
    console.error("Error updating incident:", err);
    res.status(500).json({ error: "Failed to update incident." });
  }
};

/* Deletes an incident by ID */
const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIncident = await Incident.findByIdAndDelete(id);

    if (!deletedIncident) {
      return res.status(404).json({ error: "Incident not found." });
    }

    res.status(200).json({ message: "Incident deleted successfully." });
  } catch (err) {
    console.error("Error deleting incident:", err);
    res.status(500).json({ error: "Failed to delete incident." });
  }
};

const upvoteIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { upvote } = req.body; // Receive the boolean value

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ error: "Incident not found" });
    }

    // Determine whether to increase or decrease upvotes
    const increment = upvote ? 1 : -1;

    const updatedIncident = await Incident.findByIdAndUpdate(
      id,
      { $inc: { upvotes: increment } }, // Adjust upvotes based on boolean value
      { new: true }
    );

    res.status(200).json(updatedIncident);
  } catch (err) {
    console.error("Error upvoting incident:", err);
    res.status(500).json({ error: "Failed to upvote incident." });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  upvoteIncident,
};
