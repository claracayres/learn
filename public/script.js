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
const loginButton = document.getElementById("loginBtn");
const loginHeader = document.getElementById("loginHeader");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = usernameInput.value;
  const password = passwordInput.value;

  try {
    const response = await fetch("/login", {
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

const registerSection = document.getElementById("registerSection");
const registerButton = document.getElementById("registerBtn");
const registerUsernameInput = document.getElementById("regUsername");
const registerPasswordInput = document.getElementById("regPassword");
const registerForm = document.getElementById("registerForm");
const regMessage = document.getElementById("regMessage");

registerButton.addEventListener("click", (event) => {
  registerSection.style.display = "block";
  loginForm.style.display = "none";
  loginHeader.textContent = "Register";
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = registerUsernameInput.value;
  const password = registerPasswordInput.value;

  try {
    const response = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      alert("You can now log in.");
      registerSection.style.display = "none";
      loginForm.style.display = "block";
      loginHeader.textContent = "Login";
    } else {
      alert("Registration failed. Please try again.");
    }
  } catch (error) {
    alert("An error occurred. Please try again later.");
  }

  registerForm.reset();
});
