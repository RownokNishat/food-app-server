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
    const usersCollection = client.db("tastyFood").collection("users");
    const foodCollection = client.db("tastyFood").collection("foodService");
    const orderCollection = client.db("tastyFood").collection("orders");
    const catagoriesCollection = client
      .db("tastyFood")
      .collection("catagories");
    const foodcategoryCollection = client
      .db("tastyFood")
      .collection("foodCategory");

    const foodDetailsCollection = client
      .db("tastyFood")
      .collection("foodDetails");

    //////////////users get and post//////////
    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.send(result);
    });

    ////////orders api///////
    app.post("/orders", async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.send(result);
    });

    app.get("/orders", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    ///////////////////hotel////////////////////////

    app.post("/admin/AddFoodCategory", async (req, res) => {
      console.log(req.body);
      const category = req.body;
      const cursor = foodcategoryCollection.find({
        categoryName: req.body.categoryName,
      });
      const categories = await cursor.toArray();
      if (categories.length == 0) {
        const result = await foodcategoryCollection.insertOne(category);
        res.send(result);
      } else {
        res.send({ message: "already in db" });
      }
    });

    ///////category///// jeikhane admin food add krbe oikhane category select kore dibe noyto category wise  data khuje pabo na
    app.get("/admin/getCatagories", async (req, res) => {
      const query = {};
      const cursor = foodcategoryCollection.find(query);
      const foodService = await cursor.toArray();
      res.send(foodService);
    });

    app.post("/admin/addFood", async (req, res) => {
      const result = await foodDetailsCollection.insertOne(req.body);
      res.send(result);
    });

    ////////////get all fooods ///////
    app.get("/getAllFoods", async (req, res) => {
      const query = {};
      const cursor = foodDetailsCollection.find(query);
      const foodService = await cursor.toArray();
      res.send(foodService);
    });

    ///// 1. getAllFoods
    app.put("/admin/foodUpdate/:id", async (req, res) => {
      const query = { _id: req.params.id };
      const updaeData = req.body;
      console.log(query, updaeData);
      const cursor = await foodDetailsCollection.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            foodName: req.body.foodName,
            price: req.body.price,
            details: req.body.details,
            imageUrl: req.body.imageUrl,
            categoryName: req.body.categoryName,
          },
        }
      );
      // const foodService = await cursor.toArray();
      res.send(cursor);
    });

    app.delete("/admin/foodDelete/:id", async (req, res) => {
      const cursor = await foodDetailsCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(cursor);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const foodService = await catagoriesCollection.findOne(query);
      res.send(foodService);
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
