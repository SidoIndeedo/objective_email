import React from 'react';
import "../styles/style.css"

const GlassContainer = () => {
  return (
    <div className="glass-container">
      <header>
        <h1>GLASS ALTAR</h1>
        <div className="menu">☰</div>
      </header>

      <nav>
        Today<br />
        Archives<br />
        Filters
      </nav>

      <div className="main">
        <div className="toolbar">
          <div className="toggle"></div>
          <input className="search" type="text" placeholder="Ask the archive..." />
        </div>

        <div className="cards">
          {/* Cards will go here */}
        </div>
      </div>

      <div className="sidebar-tags">
        <h3>TAGS</h3>
        <div className="tag-list">
          <span>UPCOMING</span>
          <span>ANNOUNCE</span>
          <span>MEETING</span>
          <span>REQUEST</span>
          <span>UPDATE</span>
          <span>REPORT</span>
        </div>
      </div>
    </div>
  );
};

export default GlassContainer;
