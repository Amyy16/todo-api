const { query } = require("express");
const taskModel = require("../models/task");

//create task
//private user
const createTask = async (req, res) => {
  try {
    const { userId, ...others } = req.body;
    const { id } = req.user;
    const newTask = new taskModel({ ...others, userId: id });
    const createdTask = await newTask.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//get all tasks, or with query get by category, status or deadline
//private user
const alltasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, deadline, status } = req.query;
    // create a query object
    let query = { userId }; //filter tasks based on the userid
    if (category) {
      query.category = category;
    }
    if (deadline) {
      query.deadline = { $lte: new Date(deadline) }; //get tasks with deadline on or before specified date
    }
    if (status) {
      query.status = status;
      if (!["Todo", "Ongoing", "Completed"].includes(status)) {
        return res.status(400).json({ message: "invalid status value" });
      }
    }
    const tasks = await taskModel.find(query);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get a single task
//private user
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.id;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "task does not exist" });
    }
    if (task.userId.toString() !== userid) {
      res.status(403).json({ message: "not authorized" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json(error.message);
  }
};

//update task
//private User
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, ...others } = req.body;
    const userid = req.user.id;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "task does not exist" });
    }
    if (task.userId.toString() !== userid) {
      res.status(403).json({ message: "you cannot edit this" });
    }
    const updatedtask = await taskModel.findByIdAndUpdate(id, others, {
      new: true,
    });
    res.status(200).json(updatedtask);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//delete task
//private User
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userid = req.user.id;
    const task = await taskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "task does not exist" });
    }
    if (task.userId.toString() !== userid) {
      res.status(403).json({ message: "you cannot edit this" });
    }
    await taskModel.findByIdAndDelete(id);
    res.status(200).json({ message: "task deleted successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//Displays tasks for the day (uses date)
//private

const dailyTasks = async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  try {
    const tasks = await taskModel.find({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTask,
  alltasks,
  updateTask,
  deleteTask,
  dailyTasks,
};
