import mongoose from "mongoose";
import bcrypt from "bcryptjs";

let conn = null;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema, "login");

export default async function handler(req, res) {
  if (!conn) {
    try {
      conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
      console.error("DB connection error:", error);
      return res.status(500).json({ success: false, message: "Erro ao conectar no banco" });
    }
  }

  if (req.method === "POST") {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando" });
    }

    try {
      const exists = await User.findOne({ username });
      if (exists) {
        return res.status(400).json({ success: false, message: "Usuário já existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username, password: hashedPassword });

      await newUser.save();

      return res.status(201).json({ success: true, message: "Usuário registrado com sucesso" });
    } catch (error) {
      console.error("Erro ao registrar:", error);
      return res.status(500).json({ success: false, message: "Erro ao salvar usuário" });
    }
  }

  return res.status(405).json({ success: false, message: "Método não permitido" });
}
