const express = require("express");
const listEditRouter = express.Router();
const validListEditRouter = require("../middlewares/validListEditRouter");
const connectDB = require("../db");
const { ObjectId } = require("mongodb");

listEditRouter
  .route("/list_create")
  .post(validListEditRouter, async (req, res) => {
    try {
      const data = req.body;
      const database = await connectDB();
      const collection = database.collection("todo_list");
      await collection.insertOne(data);
      const toDoListDB = await collection.find({}).toArray();
      return res.status(200).send({ toDoListUpdated: toDoListDB });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  });

listEditRouter
  .route("/list_edit/:id")
  .put(validListEditRouter, async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const data = req.body;
      const database = await connectDB();
      const collection = database.collection("todo_list");
      const filter = { _id: id };
      const updateDoc = { $set: data };
      await collection.updateOne(filter, updateDoc);
      const toDoListDB = await collection.find({}).toArray();
      return res.status(200).send({ toDoListUpdated: toDoListDB });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  })
  .delete(validListEditRouter, async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const database = await connectDB();
      const collection = database.collection("todo_list");
      await collection.deleteOne({_id : {$eq : id}});
      const toDoListDB = await collection.find({}).toArray();
      return res.status(200).send({ toDoListUpdated: toDoListDB });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  });

module.exports = listEditRouter;
