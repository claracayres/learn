import mongoose from "mongoose";

let conn = null;

// Schema do Todo
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true, unique: true },
  check: { type: Boolean, default: false },
});

const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (!conn) {
      conn = await mongoose.connect(process.env.MONGO_URI);
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: "Erro ao conectar no banco" });
  }

  // ✅ Atualizar (PUT)
  if (req.method === "PUT") {
    const { check } = req.body;

    try {
      const updatedTodo = await Todo.findByIdAndUpdate(
        id,
        { check },
        { new: true }
      );

      if (!updatedTodo) {
        return res.status(404).json({ success: false, error: "Task not found" });
      }

      return res.status(200).json({ success: true, todo: updatedTodo });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Error updating task" });
    }
  }

  // ✅ Deletar (DELETE)
  if (req.method === "DELETE") {
    try {
      const deletedTodo = await Todo.findByIdAndDelete(id);

      if (!deletedTodo) {
        return res.status(404).json({ success: false, error: "Task not found" });
      }

      return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, error: "Error deleting task" });
    }
  }

  // ❌ Método não permitido
  return res.status(405).json({ success: false, error: "Method not allowed" });
}
