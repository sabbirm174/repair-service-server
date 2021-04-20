const express = require('express')
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('mongodb');
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
  const reviewCollection = client.db("Courier").collection("review");
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


  //add review
  app.post('/addreview',(req,res)=>{
    const newService = req.body;
    reviewCollection.insertOne(newService)
    .then(result=>{
      console.log(result.insertedCount)
      res.send(result.insertedCount>0)
    })
  })

  //delete services
  app.delete('/deleteservice/:id',(req,res)=>{
    const id = req.params.id;
    serviceCollection.deleteOne({_id: ObjectID(id)})
    .then(res=>  console.log(res))
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

  //find admin
  app.post('/isadmin',(req,res)=>{
    const email = req.body.email;
    adminCollection.find({email: email})
    .toArray((err,document)=>{
      res.send(document.length>0)
    })
  })

  //seperate booking by email
  app.post('/isadminservice',(req,res)=>{
    const email = req.body.email;
    adminCollection.find({email:email})
    .toArray((err, admin)=>{
      const filter = {}
      if(admin.length === 0){
        filter.email = email;
      }
      bookingCollection.find(filter)
      .toArray((err,document)=>{
      res.send(document)
      })
    })

    
  })
  
  // get all serivice
  app.get('/allservice',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })
  // get all serivice
  app.get('/allservice',(req,res)=>{
    serviceCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  // get all serivice
  app.get('/allreview',(req,res)=>{
    reviewCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  // get all serivice
  app.get('/allbooking',(req,res)=>{
    bookingCollection.find({})
    .toArray((err,document)=>{
      res.send(document)
    })
  })

  
  console.log('database connected successfully')
});






app.listen(port)