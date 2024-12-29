const backendUrl = "https://<your-glitch-backend-url>"; // Replace with your Glitch URL

// Signup
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${backendUrl}/users`);
    const users = await response.json();

    if (users.length > 0) {
        document.getElementById("signup-message").textContent = "Only one user is allowed.";
        return;
    }

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
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "todos.html";
    } else {
        document.getElementById("login-message").textContent = "Invalid credentials.";
    }
});

// Todos
document.getElementById("todo-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const todo = document.getElementById("todo").value;

    await fetch(`${backendUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo }),
    });

    loadTodos();
});

async function loadTodos() {
    const response = await fetch(`${backendUrl}/todos`);
    const todos = await response.json();

    const list = document.getElementById("todo-list");
    list.innerHTML = todos.map((t) => `<li>${t.todo}</li>`).join("");
}

if (document.getElementById("todo-list")) loadTodos();
