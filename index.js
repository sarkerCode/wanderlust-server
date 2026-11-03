import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());
const PORT = 8000;



const client = new MongoClient(process.env.MONGODB_CLIENT_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const mongoClient = await connectToMongoDB();
const db = mongoClient.db("wanderlust")
const destinationsCollection = db.collection("destinations");

app.get('/', (req,res) => {
    res.send({message: 'Server is running fine'});
})

app.post('/add-destination', async (req, res) => {
  const data = req.body;
  console.log(data);

  const result = await destinationsCollection.insertOne(data);
  console.log(result);
  res.send(result)
})

app.get('/destinations', async (req, res) => {
  const result = await destinationsCollection.find().toArray();
  res.send(result)
})

app.get('/destination/:id', async(req, res) => {
  const {id} = req.params
  const result = await destinationsCollection.findOne({_id: new ObjectId(id)})
  res.send({result});
  
})

app.patch(`/destination/:id`, async(req, res) => {
  const {id} = req.params;
  const data = req.body;
  const result = await destinationsCollection.updateOne({_id: new ObjectId(id)}, {$set: data})
  res.send(result)
})

app.delete(`/destination/:id`, async(req, res) => {
  const {id} = req.params;
  const result = await destinationsCollection.deleteOne({_id: new ObjectId(id)})
  res.send(result)
})

app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
})