const express = require('express');
const mysql = require('mysql2');
const cors=require('cors')



const app = express();
app.use(cors());
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Shehana@13codingmart',
    database: 'eshopschema',
  });
  
  
  // Connect to the MySQL database
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL database');
  });

  app.get('/category', (req, res) => {
    // Perform a SELECT query on the 'category_list' table
    console.log('Received request for /category');

    connection.query('SELECT * FROM CATEGORY_LIST', (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      
      res.json(results);
    });
  });
  app.get('/products',  (req, res) => {
   

    connection.query('SELECT * FROM PRODUCT_LIST', (err, results) => {

        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }
          console.log(results);
          res.send({results: results});
        });
      });
      app.get('/products/category/:name', (req, res) => {
        const categoryId = req.params.name;
        console.log(categoryId);
      
        // SQL query for products without pagination
        const productSqlQuery = 'SELECT * FROM PRODUCT_LIST WHERE CD = ?';
      
        // Execute the product query
        connection.query(productSqlQuery, [categoryId], (err, results) => {
          if (err) {
            console.error('Error executing MySQL product query:', err);
            res.status(500).send('Internal Server Error');
            return;
          }
      
          if (results.length === 0) {
            // No products found for the category
            res.status(404).json({ error: 'No products found for the category' });
            return;
          }
      
          console.log(results);
          res.send({ results: results });
        });
      });
//       app.get('/search/:searchTerm', async (req, res) => {
//         try {
//           let searchterm = req.params.searchTerm;
      
//           // Construct a Solr query to search across both BRAND and PD_NAME
//           const solrQuery = `fq=(BRAND:${encodeURIComponent(searchterm)} OR PD_NAME:${encodeURIComponent(searchterm)})&q=*:*&q.op=OR&indent=true&useParams=`;
//           const solrUrl = `http://localhost:8983/solr/eshopping/select?${solrQuery}`;
//           console.log('Solr Query URL:', solrUrl);
      
//           let searchResult = await fetch(solrUrl);
//           searchResult = await searchResult.json();
      
//           // Get the search results
//           const combinedResults = searchResult.response.docs;
      
//           console.log(combinedResults);
//           res.json(combinedResults);
      
//           console.log(searchterm);
//         } catch (error) {
//           console.error('Error:', error);
//           res.status(500).send('Internal Server Error');
//         }
//       });
      
      
//       app.get('/search/:searchTerm', async (req, res) => {
//         let searchTerm = req.params.searchTerm;
    
//         // Split the search term at the first space
//         const spaceIndex = searchTerm.indexOf(' ');
//         let firstHalf = searchTerm;
    
//         if (spaceIndex !== -1) {
//             firstHalf = searchTerm.substring(0, spaceIndex);
//         }
    
//         const ur = `http://localhost:8983/solr/eshopping/select?q=PD_NAME:${firstHalf}* OR BRAND:${firstHalf}*`;
//         console.log(ur);
    
//         try {
//             let response = await fetch(ur);
    
//             if (response.ok) {
//                 let jsonResponse = await response.json();
//                 jsonResponse = jsonResponse.response.docs;
//                 console.log(jsonResponse);
//                 res.json(jsonResponse);
//             } else {
//                 console.error(`Error: ${response.status} - ${response.statusText}`);
//                 res.status(response.status).send('Error fetching data from Solr');
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             res.status(500).send('Internal Server Error');
//         }
//     });
//       app.get('/search/:searchTerm', async (req, res) => {
//   try {
//     let searchterm = req.params.searchTerm;

//     // Extract keywords, brand, and price range from the search term
//     const { keywords, brand, priceRange } = extractSearchParameters(searchterm);

//     // Construct a Solr query with full-text search, brand filter, and numeric price range filter
//     const solrQuery = `q=${encodeURIComponent(keywords)}&fq=BRAND:${encodeURIComponent(brand)}&fq=MRP:[${priceRange.start} TO ${priceRange.end}]&q.op=AND&indent=true&useParams=`;
//     const solrUrl = `http://localhost:8983/solr/eshopping/select?${solrQuery}`;
//     console.log('Solr Query URL:', solrUrl);

//     let searchResult = await fetch(solrUrl);
//     searchResult = await searchResult.json();

//     // Log intermediate results for debugging
//     console.log('Extracted Keywords:', keywords);
//     console.log('Extracted Brand:', brand);
//     console.log('Extracted Price Range:', priceRange);
//     console.log('Search Result:', searchResult);

//     // Get the search results
//     const combinedResults = searchResult.response.docs;

//     console.log(combinedResults);
//     res.json(combinedResults);

//     console.log(searchterm);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // Function to extract search parameters from the search term
// function extractSearchParameters(searchTerm) {
//   // Your logic to extract keywords, brand, and price range from the search term
//   const keywordsRegex = /(?:above|under|between)\s*(\d+(\.\d+)?)\s*(?:and\s*(\d+(\.\d+))?)/i;
//   const brandRegex = /(?:brand\s*:\s*(\w+))/i;

//   const keywordsMatch = searchTerm.match(keywordsRegex);
//   const brandMatch = searchTerm.match(brandRegex);

//   const keywords = keywordsMatch ? keywordsMatch[0] : '';
//   const brand = brandMatch ? brandMatch[1] : '';
  
//   const priceRange = keywordsMatch
//     ? { start: keywordsMatch[1] || 0, end: keywordsMatch[3] || Number.POSITIVE_INFINITY }
//     : { start: 0, end: Number.POSITIVE_INFINITY };

//   return { keywords, brand, priceRange };
// }

      
const BASE_URL = "http://localhost:8983/solr/eshopping"



let brands;
let productnames;
let notFetched = true;

if(notFetched){
    const query = 'SELECT DISTINCT BRAND FROM PRODUCT_LIST';
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            brands = results;
            // console.log("the brands is",brands)
            notFetched = false;
        }
        
     });
    const query1 = 'SELECT DISTINCT PD_NAME FROM PRODUCT_LIST'; 
    connection.query(query1, (error, results, fields) => {
        if (error) {
            console.error('Error fetching data:', error);
        } else {
            productnames = results;
            notFetched = false;
        }
     });
    }

let pricelessThanKeywords = ["below", "less","under"]
let priceGreaterThanKeywords = ["above", "greater",]

app.get('/search', async (req, res) => {
    let query = req.query.q;
   
    let isBelow = pricelessThanKeywords.some(keyword => {
        console.log( query.toLowerCase().includes(keyword) )
        return query.toLowerCase().includes(keyword)
    });
    let isAbove = priceGreaterThanKeywords.some(keyword => query.toLowerCase().includes(keyword));

    console.log("isBelow:", isBelow); 
    console.log("isAbove:", isAbove); 

    let brandsQuery = query.split("under");
    let productsQuery = query.split(" ");
    let priceQuery = query.split(" ");

    let numbersOnly = priceQuery
      .filter(value => !isNaN(value)) 
      .map(value => parseFloat(value)); 

    console.log("numbers")
    console.log(numbersOnly);    

  //   let brandValues = brandsQuery.filter(query => brands.some(brandObj => 
  //     brandObj && brandObj.brand && brandObj.brand.toLowerCase().includes((query && query.toLowerCase()))
  // ));
  // let brandValues = brands.toLowerCase().includes(query.toLocaleLowerCase())
  let brandValues = []
  console.log("the brand values array is", brandValues);
  console.log(brandsQuery);
  brandsQuery.map((word)=>{
brands.map((brand)=>{
  let b = brand.BRAND;
  let tempword = word.toLowerCase();
  let tempbrand = b.toLowerCase();
  if(tempword === tempbrand)
  {
    brandValues.push(b)

  }
})
  })
  console.log("the brand value  ----- ",brandValues)
  

        let productValues;

        productValues = productsQuery.filter(queryItem =>
            queryItem!== 'under' && 
            productnames.some(prdObj =>
               prdObj.PD_NAME.toLowerCase().includes(queryItem.toLowerCase())
            )
            );
   
    
    console.log("brands")
    console.log(brandValues);
    console.log("products")
    console.log(productValues);

    try{
        let solrUrl = `${BASE_URL}/select?`;
        //brand query
        if(brandValues.length > 0){
          console.log("the brand value  ----- ",brandValues)

            brandValues.forEach((brandValue,i) => {
                if(i>0){
                    solrUrl += `%20OR%20`;
                    solrUrl += `BRAND:*${encodeURIComponent(brandValue.slice(1))}*`;
                    
                }
                else{
                if(brandValue.length > 1)
                    solrUrl += `fq=BRAND:*${encodeURIComponent(brandValue.slice(1))}*`;
                else
                    solrUrl += `fq=BRAND:${encodeURIComponent(brandValue)}`;
                }
                console.log("the url is ",solrUrl)
            }
            )
           


        }
        if(brandValues.length > 0){
            solrUrl += `&`
        }
        //products query
        if(productValues.length > 0){
            productValues.forEach((productValue,i) => {
                if(i>0){
                    solrUrl += `%20OR%20`;
                    solrUrl += `PD_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
                }else{
                if(productValue.length>1)
                    solrUrl += `fq=PD_NAME:*${encodeURIComponent(productValue.slice(1))}*`;
                else    
                solrUrl += `fq=PD_NAME:${encodeURIComponent(productValue)}`
                }
            })
        }
        //Price query
        if(isBelow){
            solrUrl += `&fq=`;
            let Qstr = `MRP:[* TO ${numbersOnly[0]}]`
            Qstr = (encodeURIComponent(Qstr))
            solrUrl += Qstr;
        }
        if(isAbove){
            solrUrl += `&fq=`;
            let Qstr = `MRP:[${numbersOnly[0]} TO *]`
            Qstr = (encodeURIComponent(Qstr))
            solrUrl += Qstr;
        }
        //Default query
        if(productValues.length>0 || brandValues.length>0) {
            solrUrl += `&q=*%3A*`;
        }
        solrUrl += `&indent=true&wt=json`
        console.log(solrUrl)
       
        //Data fetching
        const response = await fetch(solrUrl);
        if (response.ok) {
            let jsonResponse = await response.json();
            jsonResponse = jsonResponse.response.docs;
            console.log(jsonResponse);
            res.json(jsonResponse);
        } else {
            console.error(`Error: ${response.status} - ${response.statusText}`);
            res.status(response.status).send('Error fetching data from Solr');
        }
    }catch(err){
        console.log(err);
    }
    
});
  const PORT = process.env.PORT || 2000;

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
