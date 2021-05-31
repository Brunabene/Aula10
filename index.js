var express = require('express');
var app = express();
app.use(express.json());
let banco_dados =[];

app.get('/', function(req, res) {
    res.send('Olá Mundo!');
  });

app.get('/listar', function(req, res) {
    console.log(banco_dados);
    res.send(banco_dados);
  
});

app.post('/adicionar', function(req, res) {
    const nome = req.body.nome;
    const autor = req.body.autor;
    banco_dados.push({title:nome , autor: autor})

console.log(req.body.banco_dados);

res.send(`Livros: ${nome} e ${autor}`);
  });

  app.put('/atualizar/:id',
  (req, res) => {
      const id = req.params.id - 1;
      const banco_dados_atualizado = req.body.banco_dados;
      banco_dados[id] = banco_dados_atualizado;        
      res.send("Livro atualizado com sucesso.")
  }
)
app.delete('/deletar/:id', 
  (req, res) => {
      const id = req.params.id - 1;
      delete banco_dados[id];

      res.send("Livro removido com sucesso");
  }
);


app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!');
});



app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!');
});

