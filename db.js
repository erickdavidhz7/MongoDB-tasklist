const { MongoClient} = require("mongodb");
require("dotenv").config();
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

const dbName = "todo_list_database";
const connectDB = async function(){
  await client.connect();
  const db = client.db(dbName);
  return db;
}

module.exports = connectDB;