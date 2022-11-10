const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER)
console.log(process.env.DB_PASSWORD)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yxbgeqc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('serviceReview').collection('services');
        const reviewCollection=client.db('serviceReview').collection('review');

        app.get('/services', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        })
        app.get('/servicesAll', async(req, res) =>{
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get('/services/:id', async(req,res)=>{

            const id=req.params.id;
            //console.log(id);

            const query = {_id:ObjectId(id)}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            console.log(services);
            res.send(services);


        })

        app.post('/addService', async(req,res)=>{
              const service=req.body;

              const result=await serviceCollection.insertOne(service);
              console.log(result);
              res.send(result);
             

        })

        //review collection CRUD

        //display review data

        app.get('/review', async(req,res)=>{

            const query={};
            const collectionData= reviewCollection.find(query);
            const  result= await collectionData.toArray();
            res.send(result);
        })



//insert data
        app.post('/review', async(req,res)=>{

          const review=req.body;
          console.log(review);

          const result=await reviewCollection.insertOne(review);
          console.log(result);

          res.send(result)

        });

//find specific user review
        app.get('/MyReview', async(req, res) =>{
            let query = {}
            if(req.query.email){
                query = {email: req.query.email}
            }
            const cursor = reviewCollection.find(query);
            const rev = await cursor.toArray();
            res.send(rev);
        });

        app.get('/serviceReview', async(req, res) =>{
            let query = {}
            if(req.query.serviceName){
                query = {serviceName: req.query.serviceName}
            }
            const cursor = reviewCollection.find(query);
            const rev = await cursor.toArray();
            res.send(rev);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('service review server is running')
})

app.listen(port, () => {
    console.log(`service review server running on ${port}`);
})