const express = require("express");
const listEditRouter = express.Router();
const validListEditRouter = require("../middlewares/validListEditRouter");
const connectDB = require("../db");
const mongoose = require("mongoose");
const TaskModel = require("../schemas/taskModel");
const validateJWT = require("../middlewares/validateJWT");

listEditRouter
  .route("/task_create")
  .post(validateJWT, validListEditRouter, async (req, res) => {
    try {
      const data = { ...req.body, userID: req.userDBId };
      await connectDB();
      const newTask = new TaskModel(data);
      await newTask.save();
      return res.status(200).send({ taskCreated: newTask });
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: e });
    }
  });

listEditRouter
  .route("/list_edit/:id")
  .put(validateJWT, validListEditRouter, async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);
      const data = req.body;
      await connectDB();
      const updateDoc = { $set: data };

      // User can only update their tasks
      if (req.role === "User") {
        const filter = { _id: id, userID: req.userDBId };
        await TaskModel.updateOne(filter, updateDoc);
        const toDoListDB = await TaskModel.find({
          userID: { $eq: req.userDBId },
        });
        return res.status(200).send({ toDoListUpdated: toDoListDB });
      }
      // Admin can update tasks from everyone
      else if (req.role === "Admin") {
        const filter = { _id: id };
        await TaskModel.updateOne(filter, updateDoc);
        const toDoListDB = await TaskModel.find({});
        return res.status(200).send({ toDoListUpdated: toDoListDB });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: e });
    }
  })
  .delete(validateJWT, validListEditRouter, async (req, res) => {
    try {
      const id = new mongoose.Types.ObjectId(req.params.id);

      await connectDB();
      // User can only delete their tasks
      if (req.role === "User") {
        const filter = { _id: id, userID: req.userDBId };
        await TaskModel.deleteOne(filter);
        const toDoListDB = await TaskModel.find({
          userID: { $eq: req.userDBId },
        });
        return res.status(200).send({ toDoListUpdated: toDoListDB });
      }
      // Admin can delete tasks from everyone
      else if (req.role === "Admin") {
        const filter = { _id: id };
        await TaskModel.deleteOne(filter);
        const toDoListDB = await TaskModel.find({});
        return res.status(200).send({ toDoListUpdated: toDoListDB });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send({ error: e });
    }
  });

module.exports = listEditRouter;
