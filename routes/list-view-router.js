const express = require("express");
const listViewRouter = express.Router();
const connectDB = require("../db");
const { ObjectId } = require("mongodb");

listViewRouter.route("/list_view").get(async (req, res) => {
  try {
    const database = await connectDB();
    const collection = database.collection("todo_list");
    const toDoListDB = await collection.find({}).toArray();
    return res.status(200).send({ toDoList: toDoListDB });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
});

listViewRouter.route("/list_view/:id").get(async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const database = await connectDB();
    const collection = database.collection("todo_list");
    const taskDB = await collection.findOne({ _id: { $eq: id } });
    if (taskDB) return res.status(200).send({ Task: taskDB });
    else return res.status(400).send({ error: `ID not found` });
  } catch (e) {
    return res.status(400).send({ error: `ID not found` });
  }
});

listViewRouter.route("/list_view/filter/:type").get((req, res) => {
  const type = req.params.type;
  if (type === "completed") {
    res.redirect("/list_view_completed");
  } else if (type === "not_completed") {
    res.redirect("/list_view_not_completed");
  } else {
    res.status(400).send({ error: "Invalid path name!" });
  }
});

listViewRouter.route("/list_view_completed").get(async (req, res) => {
  try {
    const type = "Completed";
    const database = await connectDB();
    const collection = database.collection("todo_list");
    const toDoListDB = await collection.find({ status: { $eq: type } }).toArray();
    return res.status(200).send({ toDoListCompleted: toDoListDB });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
});

listViewRouter.route("/list_view_not_completed").get(async (req, res) => {
  try {
    const type = "Not completed";
    const database = await connectDB();
    const collection = database.collection("todo_list");
    const toDoListDB = await collection.find({ status: { $eq: type } }).toArray();
    return res.status(200).send({ toDoListCompleted: toDoListDB });
  } catch (e) {
    return res.status(400).send({ error: e });
  }
});

module.exports = listViewRouter;
