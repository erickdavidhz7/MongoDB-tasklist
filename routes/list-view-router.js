const express = require("express");
const listViewRouter = express.Router();
const taskList = require("../utils/taskList.json");
const connectDB = require("../db");

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

listViewRouter.route("/list_view/:id").get((req, res) => {
  const id = req.params.id;
  const userTask = taskList.find(task => task.id == id);
  if (!userTask) {
    res.status(401).send({ error: "ID not found" });
  } else {
    res.status(200).send({ Task: userTask });
  }
});

listViewRouter.route("/list_view/:type").get((req, res) => {
  const type = req.params.type;
  if (type === "completed") {
    res.redirect("/list_view_completed");
  } else if (type === "not_completed") {
    res.redirect("/list_view_not_completed");
  } else {
    res.status(400).send({ error: "Invalid path name!" });
  }
});

listViewRouter.route("/list_view_completed").get((req, res) => {
  let newTaskList = taskList.filter(task => task.status !== "Not completed");
  res.status(200).send({ toDoListCompleted: newTaskList });
});

listViewRouter.route("/list_view_not_completed").get((req, res) => {
  let newTaskList = taskList.filter(task => task.status === "Not completed");
  res.status(200).send({ toDoListNotCompleted: newTaskList });
});

module.exports = listViewRouter;
