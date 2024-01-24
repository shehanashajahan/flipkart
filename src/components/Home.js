// HomePage.js

import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const history = useHistory();

  const handleExploreClick = () => {
    // Redirect to the category table page
    history.push('/category');
  };

  return (
    <div className="home-container">
      <header className="header">
        <div className="logo">
          <h1>OurShop</h1>
        </div>
        <div className="user-actions">
          <button onClick={handleExploreClick} className="explore-btn">
            Explore Categories
          </button>
        </div>
      </header>

      <main className="main-content">
        <h1 className="main-heading">Welcome to OurShop</h1>
        <p className="sub-heading">Explore our amazing products and services.</p>
        
        <div className="cta-section">
          <button onClick={handleExploreClick} className="explore-btn">
            Explore Now
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
