import { useState, useEffect } from "react";
import "../styles/AnnotationForm.css";
import ImageUpload from "./ImageUpload";
import axiosInstance from "../axiosInstance.js";
import imageCompression from "browser-image-compression";

function AnnotationForm({ onSubmit, initialData, onClose, lat, lng }) {
  const [description, setDescription] = useState(initialData?.description || "");
  const [dateOfIncident, setDateOfIncident] = useState(
    initialData?.dateOfIncident || new Date().toISOString().split("T")[0]
  );
  const [latitude, setLatitude] = useState(lat || "");
  const [longitude, setLongitude] = useState(lng || "");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1); // For PC pagination
  const [emailAlderman, setEmailAlderman] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);


  // states for general questions that apply for both streets and properties
  const [waterDepth, setWaterDepth] = useState("");
  const [waterCause, setWaterCause] = useState("");
  const [floodSpread, setFloodSpread] = useState([]);
  const [floodLocation, setFloodLocation] = useState("");
  const [floodAddress, setFloodAddress] = useState("");
  const [waterCleanliness, setWaterCleanliness] = useState("");
  const [floodTimeline, setFloodTimeline] = useState("");
  const [propertyType, setPropertyType] = useState([]);
  const [floodVisibility, setFloodVisibility] = useState("");
  const [imagePrivacy, setImagePrivacy] = useState("");
  const [otherFloodCause, setOtherFloodCause] = useState("");
  const [otherFloodLocation, setOtherFloodLocation] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLatitude(lat);
    setLongitude(lng);
    if (lat && lng) {
      const fetchAddress = async () => {
        console.log("fetching address");
        const fetchedAddress = await getAddressFromCoordinates(lat, lng);
        console.log("fetched address: ", fetchedAddress);

        // Split the address and remove the country part (last part of the address)
        const addressParts = fetchedAddress.split(" ");
        addressParts.pop(); // Remove the last element (the country)
        console.log("address without country: ", addressParts);
        addressParts.shift(); // remove the first element (actual address)
        console.log("address without house name", addressParts);
        
        var cleanedAddress = addressParts.join(" ").trim(); // Join back the address without country
        cleanedAddress = cleanedAddress.substring(0, cleanedAddress.length - 1);
        setFloodAddress(cleanedAddress); // Set the address part without country
      };

      fetchAddress();
    }
  }, [lat, lng]);

  // Function to get address from latitude and longitude
  const getAddressFromCoordinates = async (latitude, longitude) => {
    const apiKey = "AIzaSyCI0smYjmcqFq4bP5BbFzRXW5SQJE0p_70"; // Replace with your actual Google API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

    try {
      const response = await axiosInstance.get(url);
      if (response.data.status === "OK") {
        // Extract formatted address from response
        const address = response.data.results[0]?.formatted_address;
        return address || "Address not found";
      } else {
        console.error("Geocoding API error:", response.data.status);
        return "Unable to retrieve address";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error retrieving address";
    }
  };

  const handleCheckboxChange = (cause, formPortion) => {
    formPortion((prev) =>
      prev.includes(cause)
        ? prev.filter((item) => item !== cause)
        : [...prev, cause]
    );
  };

  const handleRadioChange = (value, setter) => {
    setter(value);
  };

  // Update handleSubmit to log when it's called
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log("Form submitted");
    
    // Validate description is not just whitespace
    const trimmedDescription = description.trim();
    if (trimmedDescription === "") {
      alert("Please enter a valid description.");
      return;
    }

    // Check for required fields
  if (
    !dateOfIncident || 
    !waterDepth || 
    !waterCleanliness || 
    !floodTimeline || 
    !waterCause || 
    (!floodLocation && !otherFloodLocation) || 
    !floodVisibility ||
    (images.length > 0 && floodVisibility === "Show" && !imagePrivacy) ||
    !description || description.trim() === ""
  ) {
    alert("Please fill out all required fields before submitting.");
    console.log({
      dateOfIncident,
      waterDepth,
      waterCleanliness,
      floodTimeline,
      waterCause,
      floodLocation,
      otherFloodLocation,
      floodVisibility,
      imagePrivacy,
      otherFloodCause
    });
    return;
  }

    const imagesData = await Promise.all(
      images.map(async (image) => {
        try {
          const options = { maxSizeMB: 0.2, maxWidthOrHeight: 600 };
          const compressedFile = await imageCompression(image.file, options);
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () =>
              resolve({
                data: reader.result.split(",")[1],
                contentType: compressedFile.type,
              });
            reader.onerror = reject;
            reader.readAsDataURL(compressedFile);
          });
        } catch (error) {
          console.error("Error compressing image:", error);
          return null;
        }
      })
    );

    const databaseData = {
      description,
      dateOfIncident,
      latitude,
      longitude,
      images: imagesData,
      waterDepth,
      waterCause,
      floodSpread,
      floodAddress,
      floodLocation,
      floodTimeline,
      floodVisibility,
      waterCleanliness,
      propertyType,
      imagePrivacy,
      otherFloodCause: waterCause === "Other" ? otherFloodCause : "",
      otherFloodLocation: floodLocation === "Other" ? otherFloodLocation : "",
    };

    const generateEmailBody = () => {
      return `
  
        Dear Alderman, 
        I would like to report a flooding incident. Below are the details:
  
        Incident Details:
        - Location of Flood: ${floodAddress}
        - Property Type: ${floodLocation}
        - Date of Incident: ${new Date(dateOfIncident).toLocaleDateString()}
        - Water Depth: ${waterDepth}
        - Water Cleanliness: ${waterCleanliness}
        - Flood Timeline: ${floodTimeline}
        - Flood Visibility: ${floodVisibility}
        
        Cause of Flooding:
        - ${waterCause}
        - Other cause: ${otherFloodCause || "Not specified"}
  
        ${floodSpread ? `Flood Spread:\n${floodSpread}` : ""}
  
        Flood Location Details:
        - Street/Building/Other: ${floodLocation === "Other" ? otherFloodLocation : "Not applicable"}
        
        Additional Information:
        - ${description || "No additional information provided."}
  
        Thank you for your attention to this matter.
        To view further details regarding this incident, please visit [UPDATED DOMAIN].
      `;
    };

    console.log("Data being sent from the request to the database:", databaseData);
    const formData = {
      dateOfIncident,
      images,
    };

    try {
      setFormSuccess(true);
      const response = await axiosInstance.post("/incidents", databaseData);
      onSubmit({
        ...formData,
        annotationId: response.data._id,
      });
    } catch (err) {
      console.error("Error submitting form data:", err);
      alert("An error occurred while submitting the form. Please try again.");
    }

    if (emailAlderman) {
      const emailBody = generateEmailBody();
      const subject = encodeURIComponent("Flooding Incident Report");
      const body = encodeURIComponent(emailBody);
      window.location.href = `mailto:alderman@example.com?subject=${subject}&body=${body}`;
    }
  };

  // Check if the current page has all required fields filled
  const isPageComplete = (page) => {
    switch (page) {
      case 1:
        return floodLocation !== "" || otherFloodLocation !== "";
      case 2:
        return dateOfIncident !== "";
      case 3:
        if (floodLocation === "Other") {
          return otherFloodLocation !== "";
        }
        return waterCause !== "";
      case 4:
        return waterDepth !== "";
      case 5:
        return waterCleanliness !== "";
      case 6:
        return floodTimeline !== "";
      case 7:
        return true; // Image upload is optional
      case 8:
        return description !== ""; 
      case 9:
        return (
          floodVisibility !== "" &&
          (floodVisibility === "Hide" || (images.length === 0 || imagePrivacy !== ""))
        );
      default:
        return true; 
    }
  };

  // Conditionally disable button based on page completion
  const isButtonDisabled = !isPageComplete(page);

  return (
    <div className="annotation-form-container">
      {formSuccess && (
        <div className="success-message">
          <h4>Your report has been submitted successfully!</h4>
          <p>Thank you for reporting this incident. </p>
        </div>
      )}
      <form
        className="annotation-form"
        onSubmit={(e) => {
          if (!isMobile && page !== 9) {
            e.preventDefault(); // Block submission unless on page 4 for PC
          } else {
            handleSubmit(e); // Allow submission on page 4 or mobile
          }
        }}
        data-page={page}>
        <div className="form-header">
          <h3>Report a Flooding Incident</h3>
          <button type="button" onClick={onClose} className="close-btn">
            ×
          </button>
        </div>
        <div className="form-content">
          {/* Page 1: Flood Location */}
          {(!isMobile && page === 1) || isMobile ? (
            <div className="form-group">
              <label>Location of Flood</label>
              <div className="option-grid">
                <div>
                  <input
                    type="radio"
                    id="building"
                    value="Building"
                    checked={floodLocation === "Building"}
                    onChange={(e) => setFloodLocation(e.target.value)}
                  />
                  <label htmlFor="building">Building</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="street"
                    value="Street"
                    checked={floodLocation === "Street"}
                    onChange={(e) => setFloodLocation(e.target.value)}
                  />
                  <label htmlFor="street">Street</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="other"
                    value="Other"
                    checked={floodLocation === "Other"}
                    onChange={(e) => setFloodLocation(e.target.value)}
                  />
                  <label htmlFor="other">Other</label>
                </div>
              </div>
            </div>
          ) : null}

          {/* Page 2: Date of Incident */}
          {(!isMobile && page === 2) || isMobile ? (
            <div className="form-group">
              <label>Date of Incident</label>
              <input
                type="date"
                value={dateOfIncident}
                onChange={(e) => setDateOfIncident(e.target.value)}
              />
            </div>
          ) : null}

          {/* Page 3: Water Causes */}
          {(!isMobile && page === 3) || isMobile ? (
            <>
              {floodLocation === "Building" ? (
                <div className="form-group">
                  <label>
                    What do you believe is causing the pooled/standing water?
                  </label>
                  <div className="option-grid">
                    {[
                      "Rain",
                      "Public sewer backup",
                      "Indoor appliance/pipe issues",
                      "I don't know",
                      "Other"
                    ].map((cause) => (
                      <div key={cause}>
                        <input
                          type="radio"
                          id={cause}
                          value={cause}
                          checked={waterCause === cause}
                          onChange={() => handleRadioChange(cause, setWaterCause)}
                        />
                        <label htmlFor={cause}>{cause}</label>
                      </div>
                    ))}
                  </div>
                  {waterCause === "Other" && (
                    <div className="form-group">
                      <label htmlFor="otherFloodCause">Please specify possible cause of flooding</label>
                      <input
                        type="text"
                        value={otherFloodCause}
                        id="otherFloodCause"
                        placeholder="Enter cause of flooding"
                        onChange={(e) => setOtherFloodCause(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ) : floodLocation === "Street" ? (
                <>
                  <div className="form-group">
                    <label>
                      What do you believe is causing the pooled/standing water on the street?
                    </label>
                    <div className="option-grid">
                      {[
                        "Rain",
                        "Recent construction",
                        "I don't know",
                        "Other"
                      ].map((cause) => (
                        <div key={cause}>
                          <input
                            type="radio"
                            id={`street-${cause}`}
                            value={cause}
                            checked={waterCause === cause}
                            onChange={() => handleRadioChange(cause, setWaterCause)}
                          />
                          <label htmlFor={`street-${cause}`}>{cause}</label>
                        </div>
                      ))}
                    </div>
                    {waterCause === "Other" && (
                      <div className="form-group">
                        <label htmlFor="otherFloodCause">Please specify possible cause of flooding</label>
                        <input
                          type="text"
                          id="otherFloodCause"
                          value={otherFloodCause}
                          placeholder="Enter cause of flooding"
                          onChange={(e) => setOtherFloodCause(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* New Question: How widespread is the flooding? Only for Street location */}
                  <div className="form-group">
                    <label>How widespread is the flooding?</label>
                    <div className="option-grid">
                      <div>
                        <input
                          type="radio"
                          id="specific-address"
                          value="Specific address"
                          checked={floodSpread === "Specific address"}
                          onChange={(e) => setFloodSpread(e.target.value)}
                        />
                        <label htmlFor="specific-address">Specific address</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="entire-block"
                          value="Entire block"
                          checked={floodSpread === "Entire block"}
                          onChange={(e) => setFloodSpread(e.target.value)}
                        />
                        <label htmlFor="entire-block">Entire block</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="several-blocks"
                          value="Several blocks"
                          checked={floodSpread === "Several blocks"}
                          onChange={(e) => setFloodSpread(e.target.value)}
                        />
                        <label htmlFor="several-blocks">Several blocks</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="other"
                          value="Other"
                          checked={floodSpread === "Other"}
                          onChange={(e) => setFloodSpread(e.target.value)}
                        />
                        <label htmlFor="other">Other</label>
                      </div>
                    </div>
                    {floodSpread === "Other" && (
                      <div className="form-group">
                        <label htmlFor="otherFloodSpread">Please specify the extent of the flooding</label>
                        <input
                          type="text"
                          id="otherFloodSpread"
                          placeholder="Enter details on the extent of flooding"
                          onChange={(e) => setFloodSpread(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="form-group">
                  <label>Please specify the location of the flood</label>
                  <input
                    type="text"
                    id="otherFloodLocation"
                    placeholder="Enter location of flooding"
                    onChange={(e) => setOtherFloodLocation(e.target.value)}
                  />
                </div>
              )}
            </>
          ) : null}
          {/* Page 4: Water Depth */}
          {(!isMobile && page === 4) || isMobile ? (
            <div className="form-group">
              <label>How deep is the water (make your best estimate if you don’t know)?</label>
              <div className="option-grid">
                <div>
                  <input
                    type="radio"
                    id="shallow"
                    value="Shallow (less than about 3 inches)"
                    checked={waterDepth === "Shallow (less than about 3 inches)"}
                    onChange={(e) => setWaterDepth(e.target.value)}
                  />
                  <label htmlFor="shallow">Shallow surface flooding (less than about 3 inches)</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="medium"
                    value="Medium (about 3 – 8 inches)"
                    checked={waterDepth === "Medium (about 3 – 8 inches)"}
                    onChange={(e) => setWaterDepth(e.target.value)}
                  />
                  <label htmlFor="medium">Mid-level flooding (about 3 – 8 inches)</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="deep"
                    value="Deep (about 8 – 18 inches)"
                    checked={waterDepth === "Deep (about 8 – 18 inches)"}
                    onChange={(e) => setWaterDepth(e.target.value)}
                  />
                  <label htmlFor="deep">Deep flooding (about 8 – 18 inches)</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="extreme"
                    value="Extreme (18+ inches)"
                    checked={waterDepth === "Extreme (18+ inches)"}
                    onChange={(e) => setWaterDepth(e.target.value)}
                  />
                  <label htmlFor="extreme">Extreme flooding (18+ inches)</label>
                </div>
              </div>
            </div>
          ) : null}

          {/* Page 5: Water Cleanliness */}
          {(!isMobile && page === 5) || isMobile ? (
            <div className="form-group">
              <label>Does the water have sewage in it?</label>
              <div className="option-grid">
                <div>
                  <input
                    type="radio"
                    id="yes"
                    value="Yes"
                    checked={waterCleanliness === "Yes"}
                    onChange={(e) => setWaterCleanliness(e.target.value)}
                  />
                  <label htmlFor="yes">Yes</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="no"
                    value="No"
                    checked={waterCleanliness === "No"}
                    onChange={(e) => setWaterCleanliness(e.target.value)}
                  />
                  <label htmlFor="no">No</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="idk"
                    value="I don't know"
                    checked={waterCleanliness === "I don't know"}
                    onChange={(e) => setWaterCleanliness(e.target.value)}
                  />
                  <label htmlFor="idk">I don't know</label>
                </div>
              </div>
            </div>
          ) : null}

          {/* Page 6: Flood Timeline */}
          {(!isMobile && page === 6) || isMobile ? (
            <div className="form-group">
              <label>How long have you noticed standing water?</label>
              <div className="option-grid">
                <div>
                  <input
                    type="radio"
                    id="less-than-1-hour"
                    value="Less than 1 hour"
                    checked={floodTimeline === "Less than 1 hour"}
                    onChange={(e) => setFloodTimeline(e.target.value)}
                  />
                  <label htmlFor="less-than-1-hour">Less than 1 hour</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="between-1-and-12-hours"
                    value="Between 1 and 12 hours"
                    checked={floodTimeline === "Between 1 and 12 hours"}
                    onChange={(e) => setFloodTimeline(e.target.value)}
                  />
                  <label htmlFor="between-1-and-12-hours">Between 1 and 12 hours</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="between-12-and-24-hours"
                    value="Between 12 and 24 hours"
                    checked={floodTimeline === "Between 12 and 24 hours"}
                    onChange={(e) => setFloodTimeline(e.target.value)}
                  />
                  <label htmlFor="between-12-and-24-hours">Between 12 and 24 hours</label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="24+ hours"
                    value="24+ hours"
                    checked={floodTimeline === "24+ hours"}
                    onChange={(e) => setFloodTimeline(e.target.value)}
                  />
                  <label htmlFor="24+ hours">24+ hours</label>
                </div>
              </div>
            </div>
          ) : null}

          {/* Page 7: Image Upload */}
          {(!isMobile && page === 7) || isMobile ? (
            <ImageUpload images={images} setImages={setImages} />
          ) : null}

          

          {/* Page 8: Additional Information */}
          {(!isMobile && page === 8) || isMobile ? (
            <div className="form-group">
              <label>Please Enter Any Additional Information <span className="required">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => setDescriptionTouched(true)}
                placeholder="Enter detailed description"
                rows="3"
                required
              />
              {!descriptionTouched && description.trim() === "" && (
                <div className="error-message">
                  Description cannot be empty or just whitespace
                </div>
              )}
             <label>
              Need further assistance? Report this incident at <a href="https://311.chicago.gov" style={{ color: "#000000" }}>311.chicago.gov.</a>
            </label>
            </div>
          ) : null}

          {/* Page 9: Flood Visibility and Email Alderman */}
          {(!isMobile && page === 9) || isMobile ? (
            <>
              <div className="form-group">
                <label>Would you like your flood report shown on the map?</label>
                <div className="option-grid">
                  <div>
                    <input
                      type="radio"
                      id="show"
                      value="Show"
                      checked={floodVisibility === "Show"}
                      onChange={(e) => setFloodVisibility(e.target.value)}
                    />
                    <label htmlFor="show">Show Report</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="hide"
                      value="Hide"
                      checked={floodVisibility === "Hide"}
                      onChange={(e) => setFloodVisibility(e.target.value)}
                    />
                    <label htmlFor="hide">Hide Report</label>
                  </div>
                </div>
              </div>

          {floodVisibility === "Show" && (
              <div className="form-group nested-image-privacy">
                <label>Would you like to keep your images private or make them public?</label>
                <div className="option-grid">
                  <div>
                    <input
                      type="radio"
                      id="private"
                      value="Private"
                      checked={imagePrivacy === "Private"}
                      onChange={(e) => setImagePrivacy(e.target.value)}
                    />
                    <label htmlFor="private">Private</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="public"
                      value="Public"
                      checked={imagePrivacy === "Public"}
                      onChange={(e) => setImagePrivacy(e.target.value)}
                    />
                    <label htmlFor="public">Public (Visible on map)</label>
                  </div>
                </div>
              </div>
            )}

            <div className="email-alderman-wrapper">
              <input
                  type="checkbox"
                  id="emailAlderman"
                  checked={emailAlderman}
                  onChange={(e) => setEmailAlderman(e.target.checked)}
                />
                <label htmlFor="emailAlderman">Email local alderman</label>
              </div>
            </>
          ) : null}
        </div>

        {/* Navigation */}
        <div className="form-navigation">
          {!isMobile && page > 1 && (
            <button type="button" onClick={() => setPage(page - 1)}>
              ← Back
            </button>
          )}
          {isMobile ? (
            <button 
              type="submit" 
              disabled={
                !dateOfIncident || 
                !waterDepth || 
                !waterCleanliness || 
                !floodTimeline || 
                !waterCause || 
                (!floodLocation && !otherFloodLocation) || 
                !floodVisibility ||
                (images.length > 0 && floodVisibility === "Show" && !imagePrivacy) ||
                !description || description.trim() === ""
              }
            >
              Submit
            </button>
          ) : (
            page === 9 ? (
              <button type="submit" disabled={
                !dateOfIncident || 
                !waterDepth || 
                !waterCleanliness || 
                !floodTimeline || 
                !waterCause || 
                (!floodLocation && !otherFloodLocation) || 
                !floodVisibility ||
                (images.length > 0 && floodVisibility === "Show" && !imagePrivacy) ||
                !description || description.trim() === ""
              }>Submit</button>
            ) : (
              <button type="button" onClick={() => setPage(page + 1)} disabled={isButtonDisabled}>
                Next →
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}

export default AnnotationForm;
