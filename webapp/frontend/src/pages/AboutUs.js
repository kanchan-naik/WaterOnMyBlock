import React from "react";
import { Link } from "react-router-dom";
import "../styles/AboutUs.css";
import consentForm from "../images/waterOnMyBlockConcentForm.pdf";

const AboutUs = () => {
  return (
    <div className="about-container">
      <div>
        <div>
          <h2>About Water On My Block</h2>
          <p>
            <i>Water On My Block</i> was developed by the Greater Chatham Initiative
            and researchers at the University of Chicago and was intended to be
            used by people in greater Chatham. Water On My Block empowers
            residents of Chatham by providing a centralized platform to document
            and track neighborhood flooding incidents. This tool addresses these
            issues by fostering awareness, education, and proactive involvement
            through an accessible, user-friendly interface. An interactive map
            helps visualize flooding hotspots, promoting collective
            responsibility and action, while features like anonymous reporting
            and communication with city officials ensure privacy and encourage
            advocacy.
          </p>
        </div>

        <div>
          <h2>Initial Launch Period and Citizen Science Opportunity</h2>
          <p>
            The initial launch period for <i>Water On My Block</i>  is April 12 through May 31, 2025.
            During this time, University of Chicago researchers will be monitoring the app
            and may make adjustments or fix issues based on feedback. After this period,
            the Greater Chatham Initiative will take ownership of the app and associated
            data. During the initial launch period, climate scientists from Argonne
            National Lab will be measuring flooding in Chatham. If you use the app during
            this time, your flood reports will help the scientists create a more accurate
            picture of flooding in Chicago. All data shared with scientists will be
            anonymized.
          </p>
        </div>

        <div>
          <h2>Providing Feedback</h2>
          <p>
            If you experience any issues or have any feedback on using <i>Water On My Block</i> , please fill out this
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSfffzLviXf-VQOvYEVfBzd1ie-TsIptWtkbxeLPNoRi-1JRBQ/viewform"
              target="_blank"> Water on My Block Feedback Form</a>
          </p>
        </div>

        <div>
          <h2>Consent for Initial Launch Period</h2>
          <p>
            Below is the University of Chicago consent form for using the app
            during the initial launch period (April 12 – May 31, 2025), since
            this period will be monitored by researchers and the app may be
            updated. None of your personal data will ever be shared outside the
            University of Chicago research team and the Greater Chatham
            Initiative.
          </p>
        </div>
      </div>

      <object
        data={consentForm}
        type="application/pdf"
        width="100%"
        height="1000"
        title="Consent Form"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <p>
          Your browser does not support PDFs.
          <a href={consentForm}>Download the PDF</a>
        </p>
      </object>
    </div>
  );
};

export default AboutUs;