const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9sgjt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const productsCollection = client.db("emaWatson").collection("emaWatsonPotter81");
  const ordersCollection = client.db("emaWatson").collection("orders");
  
  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertMany(products)
    .then(result => {
      console.log(result);
      res.send(result.insertCount);
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
  
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({key: {$in: productKeys}})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  app.post('/addOrders', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.insertCount > 0);
    })
  })


});


app.listen(port);