import React from "react";
import "../styles/landingPage_Features.css"

const Features = () => {
  return (
    <section className="features">
      <h2 className="features-title">Why Use Objective Mail?</h2>
      <div className="features-list">
        <div className="feature-card">
          <h3>Make your life easier</h3>
          <p>
            A tool — that is made to help you in your day to day life as a busy human.
          </p>
        </div>
        <div className="feature-card">
          <h3>Cut Through the Noise</h3>
          <p>
            Skip the clutter — we’ll pull out the important intel from long emails so you don’t have to.
          </p>
        </div>
        <div className="feature-card">
          <h3>Bite-Sized Email Insights</h3>
          <p>
            Get concise, readable summaries of big ass mails while telling you if it is important to you or not.
          </p>
        </div>
        <div className="feature-card">
          <h3>Understand Without Reading</h3>
          <p>
            Glanceable overviews of your inbox — know what’s inside without opening a single email.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
