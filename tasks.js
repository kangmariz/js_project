const tasksList = document.getElementById("tasks-list");
const addTaskBtn = document.getElementById("add-task-btn");
const deleteAllTasksBtn = document.getElementById("delete-all-btn");
const taskFormModal = document.getElementById("homework-form-modal");
const taskForm = document.getElementById("homework-form");
const taskNameInput = document.getElementById("task-name");
const taskTypeInput = document.getElementById("task-type");
const subjectInput = document.getElementById("subject");
const deadlineInput = document.getElementById("deadline");
const closeModalBtn = document.getElementById("close-modal");
const formSubmitBtn = document.getElementById("form-submit-btn");
const taskNoData = document.getElementById("task-no-data");

let classes = JSON.parse(localStorage.getItem("classes")) || [];
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editingTaskIndex = null;

function populateCourseDropdown() {
  subjectInput.innerHTML = "";
  classes.forEach((cls) => {
    const option = document.createElement("option");
    option.value = cls.courseNo;
    option.textContent = `${cls.courseNo} - ${cls.description}`;
    subjectInput.appendChild(option);
  });
}

function renderTasks() {
  tasksList.innerHTML = "";
  if (tasks.length === 0) {
    taskNoData.style.display = "block";
  } else {
    taskNoData.style.display = "none";
    tasks.forEach((task, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${task.name}</td>
            <td>${task.type}</td>
            <td>${task.course}</td>
            <td>${task.deadline}</td>
            <td class="actions">
              <button class="edit-btn" onclick="editTask(${index})">
                <i class="fas fa-edit"></i> Edit
              </button>
              <button class="delete-btn" onclick="deleteTask(${index})">
                <i class="fas fa-check-circle"></i> Complete
              </button>
            </td>
          `;
      tasksList.appendChild(row);
    });
  }
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Open task form modal
function openTaskFormModal() {
  taskFormModal.style.display = "flex";
}

// Close task form modal
function closeTaskFormModal() {
  taskFormModal.style.display = "none";
  taskForm.reset();
  editingTaskIndex = null;
  formSubmitBtn.textContent = "Add Task";
  document.getElementById("task-form-title").textContent = "Add New Task";
}

// Add or edit task event listener
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (classes.length === 0) {
    alert("Please add a course in the Classes section before creating a task.");
    return;
  }

  const taskName = taskNameInput.value;
  const taskType = taskTypeInput.value;
  const course = subjectInput.value;
  const deadline = deadlineInput.value;

  if (editingTaskIndex !== null) {
    // Update the task if editing
    tasks[editingTaskIndex] = {
      name: taskName,
      type: taskType,
      course,
      deadline,
    };
    editingTaskIndex = null;
    formSubmitBtn.textContent = "Add Task";
    document.getElementById("task-form-title").textContent = "Add New Task";
  } else {
    // Add new task if not editing
    tasks.push({ name: taskName, type: taskType, course, deadline });
  }

  saveTasks();
  renderTasks();
  closeTaskFormModal();
});

// Edit task function
function editTask(index) {
  const task = tasks[index];
  taskNameInput.value = task.name;
  taskTypeInput.value = task.type;
  subjectInput.value = task.course;
  deadlineInput.value = task.deadline;
  editingTaskIndex = index;
  openTaskFormModal();

  // Change button text and modal title for editing
  formSubmitBtn.textContent = "Save Task";
  document.getElementById("task-form-title").textContent = "Edit Task";
}

// Delete task function
function deleteTask(index) {
  if (confirm("Are you sure you have finished this task?")) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

// Delete all tasks event listener
deleteAllTasksBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("Nothing to delete.");
  } else {
    if (confirm("Are you sure you want to delete all tasks?")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  }
});

// Modal controls
addTaskBtn.addEventListener("click", openTaskFormModal);
closeModalBtn.addEventListener("click", closeTaskFormModal);

// Initial render and populate course dropdown on page load
window.onload = () => {
  populateCourseDropdown();
  renderTasks(); // Render tasks for the home section when page loads
};
