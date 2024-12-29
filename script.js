const backendUrl = "https://vivacious-short-battery.glitch.me"; 

// Signup
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${backendUrl}/users`);
    const users = await response.json();

    // Check if the email already exists
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
        document.getElementById("signup-message").textContent = "This email is already registered.";
        return;
    }

    // Add the new user
    await fetch(`${backendUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    document.getElementById("signup-message").textContent = "Signup successful!";
});

// Login
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${backendUrl}/users`);
    const users = await response.json();

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "todos.html"; // Redirect to todos page
    } else {
        document.getElementById("login-message").textContent = "Invalid credentials.";
    }
});

// Todos
document.getElementById("todo-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const todo = document.getElementById("todo").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("You must log in first.");
        return;
    }

    // Add the todo for the logged-in user
    await fetch(`${backendUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo, userId: user.id }),
    });

    loadTodos();
});

// Load Todos for the logged-in user
async function loadTodos() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("You must log in first.");
        return;
    }

    const response = await fetch(`${backendUrl}/todos?userId=${user.id}`);
    const todos = await response.json();

    const list = document.getElementById("todo-list");
    list.innerHTML = todos.map((t) => `<li>${t.todo}</li>`).join("");
}

if (document.getElementById("todo-list")) loadTodos();
