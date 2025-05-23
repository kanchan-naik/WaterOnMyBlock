import React from 'react';

function FeaturesSection() {
  return (
    <section id="features" className="features">
      <h2>Key Features</h2>
      <div className="feature-cards">
        <div className="card">
          <h3>Real-time Flood Reporting</h3>
          <p>Easily report flooding incidents in your area and contribute valuable data to the community.</p>
        </div>
        <div className="card">
          <h3>Interactive Flood Map</h3>
          <p>Visualize flooding hotspots across Chatham and see how others' experiences intersect with yours.</p>
        </div>
        <div className="card">
          <h3>Privacy & Anonymity</h3>
          <p>Feel secure knowing you can report flooding anonymously while protecting your privacy.</p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
