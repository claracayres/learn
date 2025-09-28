import mongoose from "mongoose";
import bcrypt from "bcrypt";

let conn = null;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "login");

export default async function handler(req, res) {
  if (!conn) {
    conn = await mongoose.connect(process.env.MONGO_URI);
  }

  if (req.method === "POST") {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    return res.status(200).json({ success: true, message: "Login successful" });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}
