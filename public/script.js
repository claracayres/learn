// Counter Application Script
const countLabel = document.getElementById("countLabel");
const incrementButton = document.getElementById("increaseBtn");
const decrementButton = document.getElementById("decreaseBtn");
const resetButton = document.getElementById("resetBtn");
let count = 0;

function updateLabel() {
  countLabel.textContent = count;
}

incrementButton.addEventListener("click", () => {
  count++;
  updateLabel();
});

decrementButton.addEventListener("click", () => {
  count--;
  updateLabel();
});

resetButton.addEventListener("click", () => {
  count = 0;
  updateLabel();
});

updateLabel();

// Login Form Script

const loginForm = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginHeader = document.getElementById("loginHeader");
const eyeToggle = document.getElementById("togglePassword");
const eyeIcon = document.getElementById("eyeIcon");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      alert("Login successful!");
    } else {
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    alert("An error occurred. Please try again later.");
  }

  loginForm.reset();
});

eyeToggle.addEventListener("click", () => {
  const isPressed = eyeToggle.getAttribute("aria-pressed") === "true";
  eyeToggle.setAttribute("aria-pressed", String(!isPressed));
  eyeIcon.classList.toggle("fa-eye");
  eyeIcon.classList.toggle("fa-eye-slash");
  passwordInput.type = isPressed ? "password" : "text";
});

const registerSection = document.getElementById("registerSection");
const registerButton = document.getElementById("registerBtn");
const registerUsernameInput = document.getElementById("regUsername");
const registerPasswordInput = document.getElementById("regPassword");
const registerForm = document.getElementById("registerForm");
const regEyeToggle = document.getElementById("regTogglePassword");
const regEyeIcon = document.getElementById("regEyeIcon");
const cancelRegisterButton = document.getElementById("cancelRegisterBtn");
const regUsernameMessage = document.getElementById("regUsernameMessage");

registerButton.addEventListener("click", () => {
  registerSection.style.display = "block";
  loginForm.style.display = "none";
  loginHeader.textContent = "Register";
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = registerUsernameInput.value;
  const password = registerPasswordInput.value;

  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  if (!passwordPattern.test(password)) {
    alert(
      "Password must contain at least one number, one uppercase and lowercase letter, and be at least 8 characters long."
    );
    return;
  }

  try {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      regUsernameMessage.textContent = "";
      alert("You can now log in.");
      registerSection.style.display = "none";
      loginForm.style.display = "block";
      loginHeader.textContent = "Login";
    } else {
      if (data.message && data.message.toLowerCase().includes("usuário já existe")) {
        regUsernameMessage.textContent =
          "Username already exists. Please choose another.";
      } else if (data.message) {
        regUsernameMessage.textContent = data.message;
      } else {
        regUsernameMessage.textContent =
          "Registration failed. Please try again.";
      }
    }
  } catch (error) {
    alert("An error occurred. Please try again later.");
  }

  registerForm.reset();
});

cancelRegisterButton.addEventListener("click", () => {
  registerSection.style.display = "none";
  loginForm.style.display = "block";
  loginHeader.textContent = "Login";
});

regEyeToggle.addEventListener("click", () => {
  const isPressed = regEyeToggle.getAttribute("aria-pressed") === "true";
  regEyeToggle.setAttribute("aria-pressed", String(!isPressed));
  regEyeIcon.classList.toggle("fa-eye");
  regEyeIcon.classList.toggle("fa-eye-slash");
  registerPasswordInput.type = isPressed ? "password" : "text";
});

// To-do List

const todoInput = document.getElementById("todoInput");
const addTodoButton = document.getElementById("addTodoBtn");
const todoForm = document.getElementById("todoForm");
const todoList = document.getElementById("todoList");
const filterSelect = document.getElementById("filterSelect");

todoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const task = todoInput.value.trim();
  let check = false;
  try {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task, check }),
    });
    const data = await response.json();

    if (data.success) {
      addTodo(data.todo);
    } else {
      alert("Failed to add task. Please try again.");
    }
  } catch (error) {
    alert("An error occurred. Please try again later.");
  }
  todoForm.reset();
});

function addTodo(todo) {
  const li = document.createElement("li");
  li.textContent = todo.task;
  li.dataset.id = todo._id;

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.check;

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

  function updateStyle() {
    if (checkbox.checked === true) {
      li.style.textDecoration = "line-through";
      li.style.color = "rgb(222, 113, 155)";
    } else {
      li.style.textDecoration = "none";
      li.style.color = "rgb(170, 59, 102)";
    }
  }
  updateStyle(checkbox.checked);

  checkbox.addEventListener("change", async () => {
    const id = li.dataset.id;
    const newCheck = checkbox.checked;
    updateStyle(newCheck);

    try {
      await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ check: newCheck }),
      });
      if (filterSelect.value != "all") {
        loadTodos(filterSelect.value);
      }
    } catch (error) {
      checkbox.checked = !newCheck;
      updateStyle(!newCheck);
      alert("An error occurred while updating the task.");
    }
  });

  deleteBtn.addEventListener("click", async () => {
    const id = li.dataset.id;
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        li.remove();
      } else {
        alert("Failed to delete task. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again later.");
    }
  });

  todoList.appendChild(li);
  li.appendChild(deleteBtn);
  li.prepend(checkbox);
}

async function loadTodos(filter = "all") {
  let url = "/api/todos";
  if (filter === "completed") {
    url += "?check=true";
  } else if (filter === "incomplete") {
    url += "?check=false";
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    todoList.innerHTML = "";
    data.todos.forEach(addTodo);
  } catch (error) {
    alert("An error occurred while loading tasks.");
  }
}
filterSelect.value = "all";
loadTodos();

filterSelect.addEventListener("change", () => {
  loadTodos(filterSelect.value);
});
