const path = require("path");
var mysql = require("mysql");
var bodyParser = require("body-parser");

const express = require("express");
const app = express();

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "login"
});

app.set("views", "views/");
app.set("view engine", "pug");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.resolve("public/login.html"));
});

app.post("/login.html", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    `select * from user where nome = "${email}" and password = "${senha}"`,
    function(error, results, fields) {
      if (error) throw error;
      console.log("The solution is: ", results);
    }
  );
  res.send("Ola");
});

app.get("/dashboard.html", function(req, res) {
  res.render("dashboard", { main: "Ola" });
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
