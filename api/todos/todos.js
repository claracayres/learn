import mongoose from "mongoose";

let conn = null;

// Schema do Todo
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true, unique: true },
  check: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default async function handler(req, res) {
  try {
    if (!conn) {
      conn = await mongoose.connect(process.env.MONGO_URI);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Erro ao conectar no banco" });
  }

  // ✅ Criar (POST)
  if (req.method === "POST") {
    const { task, check } = req.body;

    try {
      const todoExists = await Todo.findOne({ task });
      if (todoExists) {
        return res.status(400).json({ success: false, error: "Task already exists" });
      }

      const newTodo = new Todo({ task, check });
      await newTodo.save();

      return res.status(201).json({ success: true, todo: newTodo });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Error adding task" });
    }
  }

  // ✅ Listar (GET)
  if (req.method === "GET") {
    const { check } = req.query;
    let filter = {};
    if (check !== undefined) {
      filter.check = check === "true";
    }

    try {
      const todos = await Todo.find(filter);
      return res.status(200).json({ success: true, todos });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Error fetching tasks" });
    }
  }

  // ❌ Método não permitido
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
