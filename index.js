var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var password = require("./password");
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: password.PW_MYSQL,
  database: "join_us",
});

connection.connect();

app.get("/", function (req, res) {
  let q = "SELECT COUNT(*) AS num_users FROM users";
  let num_of_users;
  connection.query(q, function (err, result) {
    if (err) throw err;
    num_of_users = result[0].num_users;
    res.render("home", { numUsers: num_of_users });
  });
});

app.post("/register", urlencodedParser, function (req, res) {
  let user = { email: req.body.email };
  let q_insert = "INSERT INTO users SET ?";

  connection.query(q_insert, user, function (err, result) {
    if (err) throw err;
    let q = "SELECT COUNT(*) AS num_users FROM users";
    let num_of_users;
    connection.query(q, function (err, result) {
      if (err) throw err;
      num_of_users = result[0].num_users;
      res.render("welcome", { numUsers: num_of_users });
    });
  });
});

app.listen(8080, function () {
  console.log("server running on port 8080");
});
