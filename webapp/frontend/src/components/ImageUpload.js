import { useState } from "react";
import "../styles/ImageUpload.css";

const ImageUpload = ({ images, setImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageUpload = (e) => {
    console.log("file to upload:", e.target.files);
    const files = Array.from(e.target.files);

    if (files.length + images.length > 8) {
      alert("You can upload up to 8 images only.");
      return;
    }

    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      src: URL.createObjectURL(file),
      file,
    }));

    setImages((prevImages) => [...prevImages, ...newImages]);
    if (images.length === 0) {
      setCurrentImageIndex(0);
    }
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="image-container">
      <label className="upload-label">Upload Photos (Max: 8)</label>
      <div 
        className="image-upload-container"
        onClick={() => document.getElementById("image-upload-input").click()}
      >
        <input
          type="file"
          multiple
          accept=".jpeg, .png, .jpg*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
        <div className="browse-text">
          Browse Files
        </div>

        <input
          type="file"
          id="image-upload-input"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />
      </div>

      {/* Image Display with Navigation */}
      {images.length > 0 && (
        <div className="image-display">
          <img src={images[currentImageIndex].src} alt="Upload Preview" />

          <button className="nav-button left" onClick={handlePrevious}>
            {"<"}
          </button>
          <button className="nav-button right" onClick={handleNext}>
            {">"}
          </button>

          {/* Img counter */}
          <div className="image-counter">
            {`${currentImageIndex + 1} / ${images.length}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
