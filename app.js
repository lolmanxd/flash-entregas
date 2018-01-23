const path = require("path");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var pug = require("pug");
var faker = require("faker");
var cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: 3000,
  password: "root",
  database: "flash"
});

app.set("views", "views/");
app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(path.resolve("public/login.html"));
});

app.get("/buscar-clientes", function(req, res) {
  const { busca } = req.query;
  console.log(busca);
  db.query(
    `select * from user where nome like '%${busca}%'`,
    (error, result, field) => {
      console.log(result);
      if (error) {
        res.send(error);
      } else res.render("clientes", { res: result });
    }
  );
});

app.post("/cadastro", function(req, res) {
  const { email, senha, nome, data_nascimento, telefone } = req.body;
  db.query(
    "insert into usuario(email, senha, nome, data_nascimento, sexo, telefone, avatar) values(?, ?, ?, ?, ?, ?, ?)",
    [
      email,
      senha,
      nome,
      data_nascimento,
      "m",
      telefone,
      faker.internet.avatar()
    ],
    (error, result, field) => {
      if (error) {
        res.send(error);
      } else {
        res.send("Cadastrado com sucesso.");
      }
    }
  );
});

app.get("/sucess-cad.html", function(req, res) {
  res.render("sucess-cad", {});
});

app.get("/falha-cad.html", function(req, res) {
  res.render("fail-cad", {});
});

app.post("/login", (req, res) => {
  const { email, senha } = req.body;
  db.query(
    "select avatar, nome from usuario where email = ? and senha = ?",
    [email, senha],
    function(error, results, fields) {
      if (error) {
        res.send("Erro ao realizar consulta.");
      }
      console.log(results);
      if (results.length != 0) {
        res
          .cookie("email", email)
          .cookie("avatar", results[0].avatar)
          .cookie("nome", results[0].nome);
        res.redirect("/dashboard.html");
      } else res.send("Erro ao fazer login. Tente novamente.");
    }
  );
});

app.get("/dashboard.html", function(req, res) {
  res.render("encomendas", { cookies: req.cookies, query: {} });
});

app.get("/clientes.html", function(req, res) {
  res.render("clientes", {});
});

app.get("/encomendas.html", function(req, res) {
  db.query("select * from encomenda", function(error, results, fields) {
    if (error) {
      res.send("Erro ao realizar consulta.");
    } else res.render("encomendas", { query: results });
  });
});

app.get("/funcionarios.html", function(req, res) {
  res.render("funcionarios", {});
});

app.get("/veiculos.html", function(req, res) {
  res.render("/veiculos", {});
});

app.get("/relatorio.html", function(req, res) {
  res.render("relatorio", {});
});

app.get("/unidade_tratamento.html", function(req, res) {
  res.render("unidade_tratamento", {});
});

app.listen(3001, () => {
  console.log("Servidor On-line...");
});
