//Server config
const express = require('express');
const server = express();

//Configurar server pra apresentar arquivos estáticos
server.use(express.static('public'));

//Habilitar body do formulario
server.use(express.urlencoded({extended: true}));

//Configurar conexão com BD
const Pool = require('pg').Pool;
const db = new Pool({
  user:'postgres',
  password: '0000',
  host: 'localhost',
  port: 5432,
  database: 'doe'
});

//Template engine config
const nunjucks= require("nunjucks");
nunjucks.configure("./",{
  express: server,
  noCache: true,
})

//Lista de doadores
const donors=[
  {
    name: "Doador 1",
    blood: "A+"
  },
  {
    name: "Doador 2",
    blood: "B+"
  },
  {
    name: "Doador 3",
    blood: "A+"
  },
  {
    name: "Doador 4",
    blood: "AB+"
  },
]

//Apresentação da pagina
server.get("/", function(req,res){
  db.query("select * from donors", function(err, result){
    if(err) return res.send("Erro de banco de dados");
  
    const donors = result.rows;
    return res.render("index.html",{donors});
    
  })
})

//Pegar dados do formulario
server.post("/", function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const blood = req.body.blood;

  if(name =="" || email =="" || blood ==""){
    return res.send("Todos os campos são obrigatórios.");
  }

 //Adicionar valores no BD
 const query = `
      insert into donors ("name","email","blood") 
      values ($1,$2,$3)
    ` 
 const values = [name, email, blood]; 
 db.query(query, values, function(err){
    if(err) res.send("Erro no banco de dados");
    
    return res.redirect("/");

 });

})

//Liga o servidor na porta ()
server.listen(3000);