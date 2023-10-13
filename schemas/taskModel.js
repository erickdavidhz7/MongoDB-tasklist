const mongoose = require("mongoose");
const taskSchema = mongoose.Schema({
  name: { type: String, required: [true, "name is required"] },
  description: { type: String, required: [true, "description is required"] },
  status: {
    type: String,
    required: [true, "status is required"],
    enum: ["Completed", "Not completed"],
  },
});

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = TaskModel;
