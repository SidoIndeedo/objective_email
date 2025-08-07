import React from 'react';
import "../styles/landingPage_Hero.css"

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Turn Your Email Chaos into Clarity</h1>
        <p className="hero-subtitle">
          Objective Email summarizes your inbox so you only read what matters.
        </p>
        <button className="hero-btn">Start Summarizing</button>
      </div>
    </section>
  );
};

export default Hero;
