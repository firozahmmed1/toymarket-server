const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port= process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxcd8cz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
        const toyMarketCollection = client.db('ToyMarket').collection('productDB')
  
    app.post('/product', async(req,res)=>{
      const body =req.body;
      const result =await toyMarketCollection.insertOne(body)
      res.send(result);
    })

    app.get('/allproducts',async(req,res)=>{
      const result =await toyMarketCollection.find({}).toArray();
      res.send(result)
    }) 

    app.get('/allproducts/:email', async(req,res)=> {
      const result = await toyMarketCollection.find({seller_email:req.params.email}).toArray()
      res.send(result);
    })    
    
    app.get('/allproduct/:id', async(req,res)=>{
      const id = req.params.id;
      const query ={_id: new ObjectId(id)}
      const result = await toyMarketCollection.findOne(query);
      res.send(result)
    })

    app.put('/allproduct/:id', async(req, res)=>{
         const id =req.params.id;
         const filter = {_id: new ObjectId(id)};
         const options = { upsert: true };
         const updatedata = req.body;
         const udateDoc = {
          $set:{
                price:updatedata.price,
                quantity:updatedata.quantity,
                description:updatedata.description
              }
         };
         const result =await toyMarketCollection.updateOne(filter, udateDoc, options);
         res.send(result);
    })

    app.delete('/allproducts/:id', async(req,res)=>{
         const id = req.params.id;
         const query = {_id: new ObjectId(id)}
         const result = await toyMarketCollection.deleteOne(query);
         res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req,res)=>{
    res.send('Welcome to Toy market');
});

app.listen(port, ()=>{
    console.log(`Running Port on:${port}`)
})