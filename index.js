const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@test.0kqsr.mongodb.net/emaJohnCommerce?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('server is working efficiently and you can check now')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnCommerce").collection("products");
  const ordersCollection = client.db("emaJohnCommerce").collection("orders");
  
  app.post('/addProducts', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
      res.send(result.insertedCount)
    })
  })
  
  app.get('/products', (req, res) => {
    productsCollection.find({}).limit(20)
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray( (err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productsByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: { $in: productKeys}})
    .toArray( (err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

});

app.listen(process.env.PORT || 5000)