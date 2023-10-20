const express = require("express");
const listViewRouter = express.Router();
const connectDB = require("../db");
const mongoose = require("mongoose");
const TaskModel = require("../schemas/taskModel");

listViewRouter.route("/list_view").get(async (req, res) => {
  try {
    await connectDB();
    const toDoListDB = await TaskModel.find({});
    return res.status(200).send({ toDoList: toDoListDB });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

listViewRouter.route("/list_view/:id").get(async (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    await connectDB();
    const taskDB = await TaskModel.findOne({ _id: { $eq: id } });
    if (taskDB) return res.status(200).send({ Task: taskDB });
    else return res.status(400).send({ error: `ID not found` });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: `ID not found` });
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
    await connectDB();
    const toDoListDB = await TaskModel.find({ status: { $eq: type } });
    return res.status(200).send({ toDoListCompleted: toDoListDB });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

listViewRouter.route("/list_view_not_completed").get(async (req, res) => {
  try {
    const type = "Not completed";
    await connectDB();
    const toDoListDB = await TaskModel.find({ status: { $eq: type } });
    return res.status(200).send({ toDoListNotCompleted: toDoListDB });
  } catch (e) {
    console.error(e);
    return res.status(500).send({ error: e });
  }
});

module.exports = listViewRouter;
