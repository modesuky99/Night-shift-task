document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("loginForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const guestBtn = document.getElementById("guestBtn");
    const taskFormSection = document.getElementById("taskFormSection");
    const taskListSection = document.getElementById("taskListSection");
    const taskList = document.getElementById("taskList");

    let isAdmin = false;

    // Check if user is already logged in
    const isLoggedIn = JSON.parse(localStorage.getItem("loggedIn"));
    if (isLoggedIn) {
        loginSection.style.display = "none";
        taskFormSection.style.display = "block";
        taskListSection.style.display = "block";
        logoutBtn.style.display = "block";
        if (localStorage.getItem("isAdmin") === "true") {
            isAdmin = true;
        } else {
            guestBtn.style.display = "block";
        }
        loadTasks();
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username === "admin" && password === "Night2024") {
            isAdmin = true;
        }
        localStorage.setItem("isAdmin", isAdmin);
        localStorage.setItem("loggedIn", true);
        usernameInput.value = "";
        passwordInput.value = "";
        loginSection.style.display = "none";
        taskFormSection.style.display = "block";
        taskListSection.style.display = "block";
        logoutBtn.style.display = "block";
        if (!isAdmin) {
            guestBtn.style.display = "block";
        }
        loadTasks();
    });

    logoutBtn.addEventListener("click", function() {
        localStorage.clear();
        location.reload();
    });

    guestBtn.addEventListener("click", function() {
        taskList.innerHTML = ""; // Clear the task list
        loadTasks();
    });

    const taskForm = document.getElementById("taskForm");
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        if (isAdmin) {
            const taskNameInput = document.getElementById("taskName");
            const taskDateInput = document.getElementById("taskDate");
            const agentNameInput = document.getElementById("agentName");
            const taskName = taskNameInput.value.trim();
            const taskDate = taskDateInput.value;
            const agentName = agentNameInput.value.trim();

            if (taskName !== "" && taskDate !== "" && agentName !== "") {
                const task = {
                    name: taskName,
                    date: taskDate,
                    agent: agentName
                };
                addTaskToList(task);
                saveTask(task);
                taskNameInput.value = "";
                taskDateInput.value = "";
                agentNameInput.value = "";
            }
        } else {
            alert("Only administrators can add tasks.");
        }
    });

    function addTaskToList(task) {
        const li = document.createElement("li");
        li.textContent = `${task.name} - Due: ${task.date} - Agent: ${task.agent}`;
        if (isAdmin) {
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", function() {
                li.remove();
                removeTask(task);
            });
            li.appendChild(deleteBtn);
        }
        taskList.appendChild(li);
    }

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            addTaskToList(task);
        });
    }

    function removeTask(taskToRemove) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.name !== taskToRemove.name || task.date !== taskToRemove.date || task.agent !== taskToRemove.agent);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
