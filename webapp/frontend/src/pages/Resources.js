import React, { useState } from "react";
import { Link } from "react-router-dom";
import resources from "../images/resources.png";
import "../styles/Resources.css";

const floodingQA = [
  {
    question: "Is flood damage included in my homeowners policy?",
    answer: (
      <div>
        Typically, flood insurance is not included in most homeowner’s policies,
        but you can speak with a licensed agent or insurer if you are interested
        in purchasing additional coverage. Check out{" "}
        <Link to="https://www.floodsmart.gov/" target="_blank">
          FloodSmart
        </Link>
        , the National Flood Insurance Program and Check out{" "}
        <Link
          to="https://idoi.illinois.gov/consumers/consumerinsurance/floods.html#:~:text=Flood%20insurance%20is%20NOT%20typically,a%20licensed%20agent%20or%20insurer."
          target="_blank">
          the Illinois Department of Insurance
        </Link>{" "}
        for more information.
      </div>
    ),
  },
  {
    question: "Are there areas in Chicago more prone to flooding?",
    answer: (
      <div>
        <p>
          Yes, data shows that African Americans and Hispanics living on
          Chicago’s South, West and Southwest sides of the city experience
          flooding at a higher rate. Data from the Center for Neighborhood
          Technology (CFNT) support these findings. Plus, records show that
          African Americans and Hispanics in the city filed more flood damage
          insurance claims between 2007 and 2016.
        </p>
        <Link
          to="https://www.chicagofed.org/publications/blogs/chicago-fed-insights/2020/chicago-flood-risk"
          target="_blank">
          Federal Reserve Bank of Chicago
        </Link>
      </div>
    ),
  },
  {
    question:
      "How can the city of Chicago help prevent flooding in my basement?",
    answer: (
      <div>
        <p>
          One of the things the city can do is to place restrictors also known
          as “Rain Blockers” in catch basins throughout the town which help slow
          down the flow of water from the street. After about 3 or 4 hours, the
          standing water drains from the streets and into the sewers, making
          these devices an important tool for keeping water out of your
          basement.
        </p>
        <Link
          to="https://www.chicago.gov/city/en/depts/water/supp_info/basement_floodingpartnership.html"
          target="_blank">
          Chicago.gov
        </Link>
      </div>
    ),
  },
  {
    question: "How can I prevent flooding in my home or basement?",
    answer: (
      <div>
        <p>
          One of the best ways to avoid issues with flooding is to prevent them
          from occurring. Because we are all connected through an underground
          network of open pipes, what happens on your property may affect your
          neighbor and vice versa. By correcting issues before a problem arises,
          you can diminish the damages floods can cause or eliminate them
          altogether.
        </p>
        <Link
          to="https://www.chicago.gov/city/en/depts/water/supp_info/basement_floodingpartnership.html"
          target="_blank">
          Chicago.gov
        </Link>
      </div>
    ),
  },
  {
    question: "How can I get information about flood warnings?",
    answer: (
      <div>
        <p>
          You can generally find out about flood warnings through your phone,
          television, radio, or smart device, however, you can visit{" "}
          <a href="https://weather.gov" target="_blank" rel="noreferrer">
            {" "}
            weather.gov
          </a>{" "}
          or{" "}
          <a
            href="https://www.accuweather.com/en/us/chicago/60608/weather-warnings/348308"
            target="_blank"
            rel="noreferrer">
            AccuWeather
          </a>{" "}
          the most immediate and up to date information.
        </p>
        <Link to="https://weather.gov" target="_blank">
          Weather.gov
        </Link>
        <Link
          to="https://www.accuweather.com/en/us/chicago/60608/weather-warnings/348308"
          target="_blank">
          AccuWeather
        </Link>
      </div>
    ),
  },
  {
    question: "Will flooding impact my property values?",
    answer: (
      <div>
        <p>
          Yes, flooding can decrease property values, affect businesses and have
          an effect on the environment. Data also shows that certain
          neighborhoods are disproportionately affected by floods.
        </p>
        <Link
          to="https://cmap.illinois.gov/regional-plan/goals/recommendation/reduce-flood-risk-to-protect-people-and-assets/"
          target="_blank">
          Chicago Metropolitian Agency for Planning
        </Link>
      </div>
    ),
  },
  {
    question:
      "Who should I reach out to if I receive flooding in my home or basement?",
    answer: (
      <div>
        <div>
          To report a water issue, call 311 or visit{" "}
          <a href="https://311.chicago.gov" target="_blank" rel="noreferrer">
            311.chicago.gov
          </a>{" "}
          , provide information on the water's source, back-up, and location,
          and take pictures of damaged property for insurance claims.
        </div>
        <div>
          Additionally, inform your neighbors using this website or in person.
          It’s good to know if others in your area are facing similar issues to
          determine if flooding is a one-off or systemic occurrence.
        </div>
        <Link to="https://311.chicago.gov" target="_blank">
          311 Chicago
        </Link>
      </div>
    ),
  },
  {
    question: "How can I prepare my home for a flooding event?",
    answer: (
      <div>
        <p>
          When flooding is imminent or occurring, the most important thing to do
          is to take care of your own personal safety, the safety of your loved
          ones and pets. However, before a flood occurs you can minimize
          potential losses and protect your financial stability by purchasing
          insurance.
        </p>
        <Link
          to="https://www.floodsmart.gov/first-prepare-flooding"
          target="_blank">
          FEMA
        </Link>
      </div>
    ),
  },
  {
    question:
      "My home or business experienced flood damage, however, I do not have flood insurance. What resources are available for me?",
    answer: (
      <div>
        <div>
          If you don't have flood insurance, you may be eligible for assistance
          from the Federal Emergency Management Agency (FEMA) or the{" "}
          <a
            href="https://www.fema.gov/assistance/businesses/local-businesses"
            target="_blank"
            rel="noreferrer">
            U.S. Small Business Administration (SBA).
          </a>
        </div>
        <div>
          <a
            href="https://www.fema.gov/assistance/individual/program"
            target="_blank"
            rel="noreferrer">
            FEMA's Individuals and Households Program (IHP)
          </a>{" "}
          may be able to help you find temporary housing, home repair
          assistance, and hazard mitigation support.
        </div>
        <div>
          To find out more information, please check out{" "}
          <a
            href="https://www.fema.gov/es/node/663341#:~:text=If%20you%20have%20insurance%20coverage,at%20800%2D621%2D3362."
            target="_blank"
            rel="noreferrer">
            FEMA’s Individual Assistance Program for Cook County.
          </a>
        </div>
        <Link
          to="https://www.fema.gov/assistance/businesses/local-businesses"
          target="_blank">
          U.S. Small Business Administration (SBA)
        </Link>
        <Link
          to="https://www.fema.gov/assistance/individual/program"
          target="_blank">
          FEMA's Individuals and Households Program (IHP)
        </Link>
        <Link
          to="https://www.fema.gov/assistance/individual/program"
          target="_blank">
          FEMA's Individuals and Households Program (IHP)
        </Link>
      </div>
    ),
  },
  {
    question: "What should I do if I come  in contact with flood water?",
    answer: (
      <div>
        <p>
          Exposure to contaminated flood water can cause a number of
          health-related problems and the best measure to take is to avoid
          coming into contact with flood water. If you come into contact with
          flood water the Centers for Disease Control and Prevention offers
          helpful advice on what steps to take.
        </p>
        <Link
          to="https://www.cdc.gov/floods/safety/floodwater-after-a-disaster-or-emergency-safety.html#:~:text=If%20you%20come%20in%20contact,seek%20medical%20attention%20if%20necessary."
          target="_blank">
          CDC Safety Guidelines: Floodwater
        </Link>
      </div>
    ),
  },
  {
    question: "How do I protect myself during post-flood cleanup?",
    answer: (
      <div>
        <p>
          After a flooding event, it is best to wear protective clothing such as
          long sleeves and pants, in addition to wear heavy duty rubber gloves
          and boots. While investigating your home for items, be aware of
          electrical equipment and avoid contact to prevent the risks of
          electrocution. For more information, visit the{" "}
          <a
            href="https://www.epa.gov/emergencies-iaq/flood-cleanup-protect-indoor-air-and-your-health#safe3"
            target="_blank"
            rel="noreferrer">
            EPA
          </a>{" "}
          or this comprehensive list from the{" "}
          <a
            href="https://extension.umn.edu/flooding/cleaning-after-flood"
            target="_blank"
            rel="noreferrer">
            University of Minnesota
          </a>{" "}
          to find out more ways to protect yourself and those around you during
          cleanup.
        </p>
        <Link
          to="https://www.epa.gov/emergencies-iaq/flood-cleanup-protect-indoor-air-and-your-health#safe3"
          target="_blank">
          EPA
        </Link>
        <Link
          to="https://extension.umn.edu/flooding/cleaning-after-flood"
          target="_blank">
          {" "}
          The University of Minnesota
        </Link>
      </div>
    ),
  },
];

const floodingDefs = [
  {
    term: "Flash Flood Warning",
    url: "https://www.weather.gov/safety/flood-watch-warning",
    source: "weather.gov",
  },
  {
    term: "Flood Warning",
    url: "https://www.weather.gov/safety/flood-watch-warning",
    source: "weather.gov",
  },
  {
    term: "Flood Advisory",
    url: "https://www.weather.gov/safety/flood-watch-warning",
    source: "weather.gov",
  },
  {
    term: "Dew Point",
    url: "https://www.weather.gov/arx/why_dewpoint_vs_humidity",
    source: "weather.gov",
  },
  {
    term: "Humidity",
    url: "https://www.weather.gov/arx/why_dewpoint_vs_humidity",
    source: "weather.gov",
  },
  {
    term: "UV Index",
    url: "https://www.epa.gov/enviro/uv-index-description",
    source: "epa.gov",
  },
  {
    term: "Air Quality Index",
    url: "https://www.airnow.gov/aqi/aqi-basics/",
    source: "airnow.gov",
  },
];

const Collapsible = ({ open, question, answer }) => {
  /*
  This function creates toggible, collaplisble information for resources, however,
  it could could be used for other functions inside the app
  
  Inputs:
  open (bool) -> determines the the dropdown is open or closed (hides extra info
  if it's closed)
  
  question (string) -> question that is always shown even if answer isn't shown
  
  answer (string or html element) -> shown as the answer to question only if open
  is true. If there are links or bullets or other html elements, they can be 
  included in this input as well
  */
  const [isOpen, setIsOpen] = useState(open);

  const openClose = (event) => {
    // Prevent toggle when clicking on a link
    if (event.target.tagName.toLowerCase() === "a") {
      return;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="qADiv">
        <div
          className={`question-div ${isOpen ? "active" : ""}`}
          onClick={openClose}>
          <div className="question-box">
            <div>{question}</div>
            <div className="arrow-container">
              <svg
                width="14"
                height="14"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                  display: "block",
                }}>
                <path
                  d="M6.34164 8.19869C5.78885 9.30426 4.21115 9.30426 3.65836 8.19868L0.894426 2.67082C0.395751 1.67347 1.12099 0.5 2.23607 0.5H7.76393C8.879 0.5 9.60425 1.67347 9.10557 2.67082L6.34164 8.19869Z"
                  fill={isOpen ? "white" : "none"}
                  stroke={isOpen ? "white" : "black"}
                />
              </svg>
            </div>
          </div>
          <div className={`answer-div ${isOpen ? "active" : ""}`}>{answer}</div>
        </div>
      </div>
    </>
  );
};

const Resources = () => {
  const googleMapsUrl =
    "https://www.google.com/maps/place/UPS+Access+Point+location/@41.7558589,-87.6281454,14z/data=!4m10!1m2!2m1!1sP.O.+Box+19217+Chicago,+Illinois+60619!3m6!1s0x880e295d2b8ef3a7:0xf61d6e38dd5a24f7!8m2!3d41.7582879!4d-87.6141263!15sCiZQLk8uIEJveCAxOTIxNyBDaGljYWdvLCBJbGxpbm9pcyA2MDYxOZIBHHNoaXBwaW5nX2FuZF9tYWlsaW5nX3NlcnZpY2XgAQA!16s%2Fg%2F11tsfxtksn?entry=ttu&g_ep=EgoyMDI1MDEyMi4wIKXMDSoASAFQAw%3D%3D";

  const adlermanURL =
    "https://www.google.com/maps/@41.7387606,-87.624202,3a,75y,87.12h,90t/data=!3m7!1e1!3m5!1sD8BzqRgdzns1oEVG9Dqzzg!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DD8BzqRgdzns1oEVG9Dqzzg%26yaw%3D87.12!7i16384!8i8192?entry=ttu&g_ep=EgoyMDI1MDMyNS4xIKXMDSoASAFQAw%3D%3D";
  return (
    <div className="resources-container">
      <div className="banner">
        <img src={resources} alt="resources" />
        <div className="disclaimer">
          This resource guide offers general information to help you prepare and
          respond to floods, but every situation is unique and unpredictable.
          Use these materials as a starting point, and refer to the provided
          sources for more detailed and official information.
        </div>
      </div>

      <div className="contact-container">
        <h2>Connect With The Greater Chatham Initative</h2>

        <div className="about-us">
          The Greater Chatham Initiative is an organization charged with
          developing and driving the implementation of a comprehensive strategy
          to revitalize the Chatham, Auburn Gresham, Avalon Park and Greater
          Grand Crossing neighborhoods on Chicago’s south side.
        </div>
        <div className="contact-info">
          <div className="phone-number">
            Call
            <div>773-644-1451</div>
          </div>
          <Link to="mailto:info@greaterchathaminitiative.org" className="email">
            EMAIL
            <div>info@greaterchathaminitiative.org</div>
          </Link>
          <Link to={googleMapsUrl} target="_blank" className="address">
            VISIT
            <div>
              P.O. Box 19217 <br /> Chicago, Illinois 60619
            </div>
          </Link>
          <Link
            to="https://www.greaterchathaminitiative.org/"
            target="_blank"
            className="website">
            WEBSITE
            <div>www.greaterchathaminitiative.org</div>
          </Link>
        </div>
      </div>

      <div className="faq-container">
        <h2>Frequently Asked Questions</h2>
        <div className="flooding-faq">Flooding Resource Questions...</div>

        <div className="qa-container">
          {floodingQA.map((category) => (
            <Collapsible
              false
              question={category.question}
              answer={category.answer}></Collapsible>
          ))}
        </div>

        <div className="water-faq">Weather and Flood Related Terms</div>
        <div className="qa-container">
          {floodingDefs.map((category) => (
            <Link to={category.url} target="_blank" className="term-div">
              {category.term}
              <p>{category.source}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="contact-container">
        <h2>
          <b>Still have a question?</b> Reach out to your local alderman by:
        </h2>
        <div className="contact-info">
          <div className="phone-number">
            Call
            <div>773-241-3100</div>
          </div>
          <Link to="mailto:ward06@cityofchicago.org" className="email">
            EMAIL
            <div>ward06@cityofchicago.org</div>
          </Link>
          <Link to={adlermanURL} target="_blank" className="address">
            VISIT
            <div>
              8541 S. State Street <br></br>
              Chicago, IL 60619
            </div>
          </Link>
          <Link
            to="https://www.chicago.gov/city/en/about/wards/06.html"
            target="_blank"
            className="website">
            WEBSITE
            <div>Sixth Ward Alderman Office</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Resources;
