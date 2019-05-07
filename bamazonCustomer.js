// Read and set environment variables
require('dotenv').config();

//Import my npm packages
var mysql = require("mysql2");
var Table = require('cli-table3');
var inquirer = require("inquirer");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: process.env.DB_USER,

  // Your password
  password: process.env.DB_PASS,
  database: "bamazon"
});

connection.connect();

function display() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;

    var table = new Table({
      head: ['Product Id', 'Product Name', 'Price']
      , colWidths: [12, 50, 8],
      colAligns: ["center", "left", "right"],
      style: {
        head: ["aqua"],
        compact: true
      }
    });

    for(var i = 0; i < res.length; i++) {
      table.push([res[i].item_id, res[i].product_name, res[i].price]);
    }

    console.log("---------------------------------------" + '\n'
      + "     Welcome to Bamazon     " + '\n'
      + "---------------------------------------" + '\n'
      + "" + '\n'
      + "Find Your Product Below" + '\n'
      + "");

      console.log(table.toString());
  });
  
};

display();

function shopping() {
  inquirer.prompt([
    {
      name: "productToBuy",
      type: "input",
      message: "Please enter the product Id of the item you wish to purchase."
    }
  ]).then(function (answer1){
    var selection = answer1.productToBuy;
    connection.query("SELECT * FROM products WHERE item_id=?", selection, function (err, res) {
      if(err) throw err;
      if(res.length === 0) {
        console.log("That product doesn't exist, Please enter a Product Id from the list above.");
      }else{
        inquirer.prompt([
          {
            name: "quantity",
            type: "input", 
            message:"How many would you like to purchase?"
          }
        ]).then(function (answer2){
          var quantity = answer2.quantity;
          if(quantity > res[0].stock_quantity){
            console.log("Our apologies, We only have " + res[0].stock_quantity +
            " items of the product selected");
          }else{
            console.log("" +'\n'
            +res[0].product_name + " purchased." + '\n'
            + quantity + " qty @ $" + res[0].price);

            var newQuantity = res[0].stock_quantity - quantity;
            connection.query("UPDATE products SET stock_quantity = " + newQuantity 
            + "WHERE item_id = " + res[0].item_id, function (err, resUpdate) {
              if(err) throw err;
              console.log(resUpdate);
              console.log("" + '\n'
              + "Your order has been processed" + '\n'
              + "Thank you for shopping with us...!" + '\n'
              +"");
              connection.end(); 
            });
          }
          
        });
      };
    });
    
  });
  
}
setTimeout(function () {
  shopping();
}, 1000);