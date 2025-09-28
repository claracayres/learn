import mongoose from "mongoose";

let conn = null;

const todoSchema = new mongoose.Schema({
  task: { type: String, required: true, unique: true },
  check: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema, "todos");

export default async function handler(req, res) {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI);
  }

  if (req.method === "GET") {
    const { check } = req.query;
    let filter = {};
    if (check !== undefined) {
      filter.check = check === "true";
    }
    const todos = await Todo.find(filter);
    return res.status(200).json({ success: true, todos });
  }

  if (req.method === "POST") {
    const { task, check } = req.body;
    const todoExists = await Todo.findOne({ task });
    if (todoExists) {
      return res.status(400).json({ success: false, error: "Task already exists" });
    }
    const newTodo = new Todo({ task, check });
    await newTodo.save();
    return res.status(201).json({ success: true, todo: newTodo });
  }

  if (req.method === "PUT") {
    const { id } = req.query;
    const { check } = req.body;
    const todo = await Todo.findByIdAndUpdate(id, { check }, { new: true });
    if (!todo) return res.status(404).json({ success: false, error: "Task not found" });
    return res.status(200).json({ success: true, todo });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) return res.status(404).json({ success: false, error: "Task not found" });
    return res.status(200).json({ success: true, message: "Task deleted successfully" });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
