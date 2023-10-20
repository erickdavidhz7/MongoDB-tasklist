const mongoose = require("mongoose");
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const taskSchema = mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    description: { type: String, required: [true, "description is required"] },
    status: {
      type: String,
      required: [true, "status is required"],
      enum: ["Completed", "Not completed"],

    },
    userID : {type: ObjectId , required: [true, "user is required"]}
  },
  { versionKey: false }
);

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = TaskModel;
