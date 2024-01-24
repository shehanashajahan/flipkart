// Import necessary libraries and styles
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './frontpage.css';


const CategoryTable = () => {
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:2000/category") // Use the correct endpoint (e.g., /category)
      .then((response) => response.json())
      .then((data) => setCategory(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="website-container">
      <div className="entry-container text-center">
        <h1>Welcome to Our Shop</h1>
        <p>Discover a variety of products to suit your needs.</p>
        <Link to="/products" className="btn btn-all-products">
          View All Products
        </Link>
      </div>

      <div className="container mt-5">
        <h2 className="text-center">Category List</h2>

        <div className="category-container">
          {category.map((category) => (
            <div key={category.PD_ID} className="category-item">
              <Link to={`/products/category/${encodeURIComponent(category.CATEGORY_NAME)}`}>
                <img
                  src={`./images/category${category.CD_ID}.jpg`}
                  alt={category.CATEGORY_NAME}
                  className="category-image"
                />
                <div className="category-overlay">
                  <span className="category-name">{category.CATEGORY_NAME}</span>
                  <span className="product-count">{category.PRODUCT_COUNT} Products</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTable;
