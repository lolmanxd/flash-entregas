const path = require("path");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var morgan = require("morgan");

const express = require("express");
const app = express();

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "flash"
});

app.set("views", "views/");
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.resolve("public/login.html"));
});

app.post("/cadastro", function(req, res) {
  const { email, senha, nome, data_nascimento } = req.body;
  db.query(
    "insert into user values(?, ?, ?, ?)",
    [email, senha, nome, data_nascimento],
    (error, result, field) => {
      if (error) {
        res.send("Erro ao cadastrar, tente novamente.");
      } else {
        res.send("Cadastrado com sucesso.");
      }
    }
  );
});

app.get("/clientes", (req, res) => {
  res.render("clientes");
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  db.query(
    "select * from user where email = ? and senha = ?",
    [email, senha],
    function(error, results, fields) {
      if (error) {
        res.send("Erro ao realizar consulta.");
      }

      if (results.length != 0) {
        res.redirect("/dashboard.html");
      } else res.send("Erro ao fazer login. Tente novamente.");
    }
  );
});

app.get("/dashboard.html", function(req, res) {
  res.render("clientes", {});
});

app.get("/encomendas.html", function(req, res) {
  res.render("encomendas", {});
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
