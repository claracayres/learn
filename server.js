const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    "mongodb+srv://claracayres1205:12m17g14d19n@portfolio.jwkqxpi.mongodb.net/learn_test?retryWrites=true&w=majority&appName=portfolio"
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema, "login");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error registering user" });
  }
});

// Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//  tasks
const todoSchema = new mongoose.Schema({
  task: { type: String, required: true, unique: true },
  check: { type: Boolean, default: false },
});

const Todo = mongoose.model("Todo", todoSchema, "todos");

app.post("/todos", async (req, res) => {
  const { task, check } = req.body;
  try {
    const todoExists = await Todo.findOne({ task });
    if (todoExists) {
      return res.status(400).json({ success: false, error: "Task already exists" });
    }
    const newTodo = new Todo({ task, check });
    await newTodo.save();
    res.status(201).json({ success: true, todo: newTodo });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error adding task" });
  }
});

app.get("/todos", async (req, res) => {
  const { check } = req.query;
  let filter = {};
  if (check !== undefined) {
    filter.check = check === "true";
  }
  try {
    const todos = await Todo.find(filter);
    res.status(200).json({ success: true, todos });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching tasks" });
  }
});

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { check } = req.body;

  try {
    const todo = await Todo.findByIdAndUpdate(id, { check }, { new: true });
    if (!todo) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.status(200).json({ success: true, todo });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating task" });
  }
});

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByIdAndDelete(id);
    if (!todo) {
      return res.status(404).json({ success: false, error: "Task not found" });
    }
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting task" });
  }
});
