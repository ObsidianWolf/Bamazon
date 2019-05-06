// Read and set environment variables
require('dotenv').config();

//Import my npm packages
var mysql = require("mysql2");
var inquirer = require("inquirer");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Root",
    database: "bamazon"
  });

  connection.connect(function(err) {
    if (err) throw err; 
    loadProducts();
  });

  function loadProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }
      console.log("-----------------------------------");
    });
  }
  //
