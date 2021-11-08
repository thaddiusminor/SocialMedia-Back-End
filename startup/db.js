const mongoose = require("mongoose");
const config = require("config");

const { MongoClient } = require("mongodb");
// const uri = "mongodb+srv://thaddius:<password>@cluster0.2e2ud.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(config.get("mongoURI"), {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// client.connect((err) => {
//   const collection = client.db("myFirstDatabase").collection("status");
//   let result = collection.find({ email: "johnwick@gmail.com" });
//   console.log(result);
//   // perform actions on the collection object
// client.close();
// });

async function makeClient() {
  let conn;
  try {
    conn = await client.connect();
  } catch (err) {
    console.log(`Could not connect to MongoDB. ERROR: ${err}`);
    process.exit(1);
  }
  return conn;
}

function connectDB() {
  mongoose
    .connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB..."))
    .catch((err) => {
      console.log(`Could not connect to MongoDB. ERROR: ${err}`);
      process.exit(1);
    });
}

module.exports = { connectDB, makeClient };
