const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require("dotenv").config();
////////////middile wares///////////

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ub96tpd.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const foodCollection = client.db("tastyFood").collection("foodService");
    const orderCollection = client.db("tastyFood").collection("orders");
    const catagoriesCollection = client
      .db("tastyFood")
      .collection("catagories");
    app.get("/catagories", async (req, res) => {
      const query = {};
      const cursor = catagoriesCollection.find(query);
      const foodService = await cursor.toArray();
      res.send(foodService);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const foodService = await catagoriesCollection.findOne(query);
      res.send(foodService);
    });

    ////////orders api///////
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    app.post("/catagories", async (req, res) => {
      const catagories = req.body;
      const result = await catagoriesCollection.insertOne(catagories);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("food service is running");
});

app.listen(port, () => {
  console.log(`food service is running on ${port}`);
});
