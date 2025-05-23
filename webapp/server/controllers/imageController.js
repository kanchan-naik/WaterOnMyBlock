const Image = require("../models/imageModel");

/* Uploads an image and associates it with an incident */
const uploadImage = async (req, res) => {
  try {
    const { incidentId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const newImage = new Image({
      incidentId,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });

    await newImage.save();
    res.status(201).json({ message: "Image uploaded successfully." });
  } catch (err) {
    console.error("Error uploading image:", err);
    res.status(500).json({ error: "Failed to upload image." });
  }
};

/* Retrieves an image by its ID */
const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ error: "Image not found." });
    }

    res.set("Content-Type", image.contentType);
    res.send(image.data);
  } catch (err) {
    console.error("Error retrieving image:", err);
    res.status(500).json({ error: "Failed to retrieve image." });
  }
};

/* Deletes an image by its ID */
const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedImage = await Image.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ error: "Image not found." });
    }

    res.status(200).json({ message: "Image deleted successfully." });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Failed to delete image." });
  }
};

module.exports = { uploadImage, getImageById, deleteImage };
