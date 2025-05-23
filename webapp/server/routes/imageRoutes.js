const express = require("express");
const { uploadImage, getImageById } = require("../controllers/imageController");
const upload = require("../middlewares/multerConfig");

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/:id", getImageById);

module.exports = router;