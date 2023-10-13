const express = require("express");
const listEditRouter = express.Router();
const validListEditRouter = require("../middlewares/validListEditRouter");
const connectDB = require("../db");
const mongoose = require("mongoose");
const TaskModel = require("../schemas/taskModel");

listEditRouter
  .route("/task_create")
  .post(validListEditRouter, async (req, res) => {
    try {
      const data = req.body;
      await connectDB();
      const newTask = new TaskModel(data);
      await newTask.save();
      const toDoListDB = await TaskModel.find({});
      return res.status(200).send({ toDoListUpdated: toDoListDB });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  });

listEditRouter
  .route("/list_edit/:id")
  .put(validListEditRouter, async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const data = req.body;
      await connectDB();
      const filter = { _id: id };
      const updateDoc = { $set: data };
      await TaskModel.updateOne(filter, updateDoc);
      const toDoListDB = await TaskModel.find({});
      return res.status(200).send({ toDoListUpdated: toDoListDB });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ error: e });
    }
  })
  .delete(validListEditRouter, async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      await connectDB();
      await TaskModel.deleteOne({_id : {$eq : id}});
      const toDoListDB = await TaskModel.find({});
      return res.status(200).send({ toDoListUpdated: toDoListDB });
    } catch (e) {
      return res.status(400).send({ error: e });
    }
  });

module.exports = listEditRouter;
