const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzmkl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = process.env.PORT || 2000;

//middle ware
app.use(cors());
app.use(bodyParser.json())

//method
app.get('/',(req,res)=>{
  res.send("hello world")
})

//database connect


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("Courier").collection("Service");
  const bookingCollection = client.db("Courier").collection("booking");
  const adminCollection = client.db("Courier").collection("admin");
  // perform actions on the collection object
  //client.close();
  app.post('/addbook',(req,res)=>{
    const newEvent = req.body;
    console.log('addign new evwnt', newEvent);
    bookingCollection.insertOne(newEvent)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  //add services
  app.post('/addservices',(req,res)=>{
    const newService = req.body;
    serviceCollection.insertOne(newService)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  //add admin
  app.post('/addadmin',(req,res)=>{
    const newEvent = req.body;
    console.log('addign new admin', newEvent);
    adminCollection.insertOne(newEvent)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })
  
  // get all serivice
  app.get('/allservice',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  console.log('database connected successfully')
});






app.listen(port)