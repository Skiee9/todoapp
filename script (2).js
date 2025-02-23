const backendUrl = "https://vivacious-short-battery.glitch.me"; 
// linkl of db deploy

// Signup
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    // getting mail and password
    const email = document.getElementById("email").value;  
    const password = document.getElementById("password").value;

    const response = await fetch(`${backendUrl}/users`);
    const users = await response.json();

    // Check if user exist already
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

// Login for user 
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

//  fetch the user info
    const response = await fetch(`${backendUrl}/users`); 
    const users = await response.json();

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
        // information store in db
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "todos.html"; // got otto todo
    } else {
        document.getElementById("login-message").textContent = "Invalid credentials.";
    }
});

// Add Todo
document.getElementById("todo-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const status = document.getElementById("status").value;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("You must log in first.");
        return;
    }
    if (!title || !description || !status) {
        alert("Please fill in all fields.");
        return;
    }
    // personal confirmation console can ;do
    console.log("Adding Todo:", { title, description, status, userId: user.id });

// add todo with information
    await fetch(`${backendUrl}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            title,
            description,
            status,
            userId: user.id
        }),
    });

    loadTodos(); 
});
// for menu buton
function toggleNavbar() {
    const nav = document.getElementById('navbar');
    nav.classList.toggle('show'); // Toggle the navbar visibility
}
// wili load
async function loadTodos() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("You must log in first.");
        return;
    }

    const response = await fetch(`${backendUrl}/todos?userId=${user.id}`);
    const todos = await response.json();

    const list = document.getElementById("todo-list");
// add todo
    if (todos.length > 0) {
        list.innerHTML = todos.map((t) => `
            <li>
                <strong>Title:</strong> ${t.title}<br>
                <strong>Description:</strong> ${t.description}<br>
                <strong>Status:</strong> ${t.status}<br>
            </li>
        `).join("");
    } else {

        list.innerHTML = "<li>No todos available.</li>";
    }
}

if (document.getElementById("todo-list"))
    
    loadTodos();
