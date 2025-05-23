const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident", // Assuming you have an Incident model to reference
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Optional: to store the date when the image was created or modified
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;
