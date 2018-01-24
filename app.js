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

app.get("/popular-banco", function(req, res) {
  faker.locale = "pt_BR";

  user = endereco => ({
    email: faker.internet.email(),
    senha: faker.internet.password(),
    nome: faker.name.findName(),
    avatar: faker.internet.avatar(),
    tipo_acesso: "fisica",
    cpf: faker.random.number(),
    sexo: "m",
    data_nascimento: faker.date.past(),
    endereco
  });

  endereco = () => ({
    id: faker.random.number(),
    logradouro: faker.address.streetName(),
    cep: faker.address.zipCode(),
    cidade: faker.address.city(),
    bairro: faker.address.city(),
    estado: faker.address.state(),
    telefone: faker.phone.phoneNumber()
  });

  db.query(
    "insert into endereco values(?, ?, ?, ?, ?, ?, ?)",
    Object.values(endereco()),
    (error, result, field) => {
      if (error) {
        res.send(error);
      } else
        db.query(
          "insert into usuario values(?, ?, ?, ?, ?, ?, ?, ?, ?)",
          Object.values(user(result.insertId)),
          (error, result, field) => {
            if (error) {
              res.send(error);
            } else res.send(result);
          }
        );
    }
  );
});

app.get("/", function(req, res) {
  res.sendFile(path.resolve("public/login.html"));
});

app.get("/buscar-clientes", function(req, res) {
  const { busca } = req.query;

  db.query(
    "select * from usuario",
    //`select * from usuario where nome like '%${busca}%'`,
    (error, result, field) => {
      if (error) {
        res.send(error);
      } else res.render("clientes", { cookies: req.cookies, query: result });
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
  console.log("Avatar: ", req.cookies.avatar);
  res.render("clientes", { cookies: req.cookies, query: {} });
});

app.get("/encomendas.html", function(req, res) {
  db.query("select * from encomenda", function(error, results, fields) {
    if (error) {
      res.send("Erro ao realizar consulta.");
    } else res.render("encomendas", { cookies: req.cookies, query: results });
  });
});

app.get("/funcionarios.html", function(req, res) {
  res.render("funcionarios", { cookies: req.cookies, query: {} });
});

app.get("/veiculos.html", function(req, res) {
  res.render("veiculos", { cookies: req.cookies, query: {} });
});

app.get("/relatorio.html", function(req, res) {
  res.render("relatorio", { cookies: req.cookies, query: {} });
});

app.get("/unidade_tratamento.html", function(req, res) {
  res.render("unidades-tratamentos", { cookies: req.cookies, query: {} });
});

app.listen(3001, () => {
  console.log("Servidor On-line...");
});
