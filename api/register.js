const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let connection = null;

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model("User", userSchema, "login");
export default async function handler(req, res) {
  if (!connection) {
    connection = await mongoose.connect(process.env.MONGODB_URI);
  }
    if (req.method === "POST") {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    return res.status(201).json({ success: true, message: "User registered successfully" });
  }

  return res.status(405).json({ success: false, error: "Method not allowed" });
}

