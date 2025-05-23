const mongoose = require('mongoose');

// Define schema for Incident
const incidentSchema = new mongoose.Schema(
  {
    description: { type: String, required: true }, // Detailed description of the incident (matching 'description' from the form)
    dateOfIncident: { type: Date, required: true }, // Date of the incident (matching 'dateOfIncident' from the form)
    latitude: { type: Number, required: true }, // Latitude (from form, required)
    longitude: { type: Number, required: true }, // Longitude (from form, required)
    upvotes: { type: Number, default: 0 }, // Upvotes counter (defaults to 0)
    waterDepth: { type: String, required: true }, // Depth of water (from 'waterDepth')
    waterCauses: { type: [String], required: true }, // List of causes of flooding (from 'waterCauses')
    floodAddress: { type: [String], required: true }, 
    floodSpread: { type: [String], required: true }, // Spread of the flooding (from 'floodSpread')
    floodLocation: { type: String, required: true }, // Location of the flood (from 'floodLocation')
    waterCleanliness: { type: String, required: true }, // Water cleanliness (from 'waterCleanliness')
    floodTimeline: { type: String, required: true }, // Timeline of flooding (from 'floodTimeline')
    propertyType: { type: [String] }, // Type of property affected (from 'propertyType')
    floodVisibility: { type: String, required: true }, // Visibility of flood (from 'floodVisibility')
    otherFloodCause: { type: String }, // Other possible causes of flooding (from 'otherFloodCause')
    otherFloodLocation: { type: String }, // Other possible locations for flooding (from 'otherFloodLocation')
    emailAlderman: { type: Boolean, default: false }, // Whether the user wants to email the alderman (from 'emailAlderman')
    imagePrivacy: { type: String, enum: ["Private", "Public"], default: "Private" },
    
    // Array to store images as buffers (matches 'images' array in the form)
    images: [
      {
        data: { type: Buffer }, // Store image as buffer
        contentType: { type: String }, // MIME type of the image
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Index for location coordinates for geospatial queries
incidentSchema.index({ location: '2dsphere' });

// Create the model for Incident
const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;

