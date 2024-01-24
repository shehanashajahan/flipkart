import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Products.css';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from your server API
    // Example API endpoint: http://localhost:2000/products
    fetch("http://localhost:2000/products", {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).then((res) => res.json().then((data) => { setCategories(data.results) }))
  }, [categoryName, currentPage, productsPerPage]);

  useEffect(() => {
    // Update the URL whenever the currentPage or selectedCategory changes
    let url = '/products';
    if (selectedCategory) {
      url += `/category/${selectedCategory.toLowerCase()}`;
    }
    url += `?page=${currentPage}`;

    navigate(url);
  }, [navigate, currentPage, selectedCategory]);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const performSolrSearch = async () => {
    // try {
    //   console.log("yes entrn")
    //   console.log("passing searechterm ",searchTerm)
    //   let response = await fetch(`http://localhost:2000/search/${searchTerm}`)
    //   response = await response.json()
    //   console.log(response)
      
    // } catch (error) {
    //   console.error('Error performing Solr search:', error);
    // }
  };

  const handleSearch = (e) => {
    // Perform Solr search
e.preventDefault()
    navigate(`/Solrsearch/${searchTerm}`)
    console.log(searchTerm)
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = searchTerm ? searchResults.slice(indexOfFirstProduct, indexOfLastProduct) : categories.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const nextPage = () => {
    const data = searchTerm ? searchResults : categories;
    if (currentPage < Math.ceil(data.length / productsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToHome = () => {
    navigate('/category');
  };

  return (
    
      <div className="container">
        <h1 className="text-center">Product Table</h1>
        <div>
      <button onClick={goToHome}>Home</button>
      <div>
        <form onSubmit={handleSearch}> 
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        </form>
        <button onClick={handleSearch}>Search</button>
      </div>
        <div className="mb-3">
          <label htmlFor="categoryDropdown" className="form-label"></label>
          <select
            id="categoryDropdown"
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            <option value="Clothing">Clothing</option>
            <option value="Electronics">Electronics</option>
            <option value="DiaryProducts">DiaryProducts</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Groceries">Groceries</option>
            <option value="Cosmetics">Cosmetics</option>
            {categories.map((category) => (
              <option key={category.id} value={category.Category}>
                {category.Category}
              </option>
            ))}
          </select>
        </div>

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>CD_ID</th>
              <th>PD_ID</th>
              <th>PD_NAME</th>
              <th>CD</th>
              <th>BRAND</th>
              <th>MRP</th>
              <th>DISCOUNT</th>
              <th>STOCK</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((category) => (
              <tr key={category.id}>
                <td>{category.CD_ID}</td>
                <td>{category.PD_ID}</td>
                <td>{category.PD_NAME}</td>
                <td>{category.CD}</td>
                <td>{category.BRAND}</td>
                <td>{category.MRP}</td>
                <td>{category.DISCOUNT}</td>
                <td>{category.STOCK}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className='pagination-container'>
          <button onClick={prevPage} disabled={currentPage === 1} className='pagination-button prev'>
            Prev
          </button>
          {Array.from({ length: Math.ceil(categories.length / productsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              disabled={currentPage === index + 1}
              className='pagination-button'
            >
              {index + 1}
            </button>
          ))}
          <button onClick={nextPage} disabled={currentPage === Math.ceil(categories.length / productsPerPage)} className='pagination-button next'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Products;
