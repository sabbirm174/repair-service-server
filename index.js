const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser =require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5055;

//middleware
app.use(cors());
// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzmkl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("EasyShop").collection("Products");
  const addProductsCollection = client.db("EasyShop").collection("addProduct");
  
  //post into database
  app.post('/addEvent',(req,res)=>{
    const newEvent = req.body;
    productsCollection.insertOne(newEvent)
    .then(result=>{
      console.log('inserted count', result.insertedCount)
      if(result.insertedCount> 0){
        res.send(newEvent);
      }
      
    })
  })
  
  //post single product into database
  app.post('/addProduct',(req,res)=>{
    const newEvent = req.body;
    addProductsCollection.insertOne(newEvent)
    .then(result=>{
      console.log('inserted count', result.insertedCount)
      if(result.insertedCount> 0){
        res.send(newEvent);
      }
    })
  })

  //single product load
  app.get("/edit/:id",(req,res)=>{
    const id = req.params.id;
    productsCollection.find({_id: ObjectID(id)})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  //single product load
  app.delete("/delete/:id",(req,res)=>{
    const id = req.params.id;
    productsCollection.deleteOne({_id: ObjectID(id)})

  })

  // get from database
  app.get("/allProducts",(req,res)=>{
    productsCollection.find()
    .toArray((err,items)=>{
      res.send(items);
    })
  })

  // get from database
  app.get("/loadProduct",(req,res)=>{
    const email = req.query.email;
    console.log(email);
    addProductsCollection.find({email:email})
    .toArray((err,items)=>{
      res.send(items);
    })
  })
  
});




app.listen(port)