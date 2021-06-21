var express = require('express');
var app = express();
app.use(express.json());

var cors = require('cors');
app.use(cors());
let banco_dados = [];

app.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
  res.send('Olá Mundo!');
});


app.get('/listar', function (req, res) {
  console.log(banco_dados);
  res.send(banco_dados);

});

app.post('/adicionar', function (req, res) {
  const nome = req.body.nome;
  const autor = req.body.autor;
  banco_dados.push({ title: nome, autor: autor })

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
/*
  Daqui para baixo, uso o banco de dados MongoDB
*/

const mongodb = require('mongodb')
const password ="UuYYdoF76TdfFsaP"
// const password = process.env.PASSWORD || "asdf";
// console.log(password);


// const connectionString = `mongodb+srv://admin:${password}@cluster0.fhdc2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const connectionString = `mongodb+srv://admin:${password}@cluster0.6tiob.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

(async () => {

  const client = await mongodb.MongoClient.connect(connectionString, options);
  const db = client.db('MyFirstDatabase');
  var livros = db.collection('livros');
  console.log(await livros.find({}).toArray());

  app.get('/database',
    async function (req, res) {
      // res.send(mensagens);
      res.send(await livros.find({}).toArray());
    });

  app.get('/database/:id',
    async function (req, res) {
      const id = req.params.id;
      const livro = await livros.findOne(
        { _id: mongodb.ObjectID(id) }
      );
      console.log(livro);
      if (!livro) {
        res.send("Livro não encontrado");
      } else {
        res.send(livro);
      }
    }
  );

app.post('/database',
  async (req, res) => {
    console.log(req.body);
    const livro = req.body;
    delete livro["_id"];
    livros.insertOne(livro);
    res.send("criar um livro.");
  }
);

app.put('/database/:id',
  async (req, res) => {
    const id = req.params.id;
    const livro = req.body;

    console.log(livro);

    delete livros["_id"];

    const num_livros = await livros.countDocuments({ _id: mongodb.ObjectID(id) });

    if (num_livros !== 1) {
      res.send('Ocorreu um erro por conta do número de livros');
      return;
    }

    await livros.updateOne(
      { _id: mongodb.ObjectID(id) },
      { $set: livro}
    );

    res.send("Livro atualizado com sucesso.")
  }
)

app.delete('/database/:id',
  async (req, res) => {
    const id = req.params.id;

    await livros.deleteOne({ _id: mongodb.ObjectID(id) });

    res.send("Livro removido com sucesso");
  }
);

})();

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://admin:<UuYYdoF76TdfFsaP>@cluster0.6tiob.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


