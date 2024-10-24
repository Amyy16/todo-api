const express = require("express");
const routes = express.Router();
const {
  createTask,
  alltasks,
  getTask,
  updateTask,
  deleteTask,
  dailyTasks,
} = require("../controllers/task");
const { verify } = require("../middlewares/verify");

routes.post("/task", verify, createTask);
routes.get("/task/today", verify, dailyTasks);
routes.get("/task", verify, alltasks);
routes.get("/task/:id", verify, getTask);
routes.put("/task/:id", verify, updateTask);
routes.delete("/task/:id", verify, deleteTask);

module.exports = routes;
