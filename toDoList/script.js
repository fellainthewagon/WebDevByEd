const todoInput = document.querySelector(".todo-input");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

//functions
// add LI to DIV
function addLi(todoDiv) {
  const newTodo = document.createElement("li");
  newTodo.innerText = todoInput.value;
  newTodo.classList.add("todo-item");
  todoDiv.appendChild(newTodo);
}

// add complete btn to DIV
function addCompBtn(todoDiv) {
  const completedButton = document.createElement("button");
  completedButton.innerHTML = '<i class="fas fa-check"></i>';
  completedButton.classList.add("complete-btn");
  todoDiv.appendChild(completedButton);
}

// add delete btn to DIV
function addDelBtn(todoDiv) {
  const trashButton = document.createElement("button");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';
  trashButton.classList.add("trash-btn");
  todoDiv.appendChild(trashButton);
}

// add todo to LS
function saveLocalTodos(todo) {
  let todos = checkLocalStorage();

  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos)); // add todo in array & back to LocalStorage
}

// remove todo from LS
function removeLocalTodos(todo) {
  let todos = checkLocalStorage();

  const innerTextTodo = todo.children[0].innerText; // todo is DIV, we need LI - it's has i=0 element
  todos.splice(todos.indexOf(innerTextTodo), 1);
  localStorage.setItem("todos", JSON.stringify(todos)); // add array to LS without deleted todo
}

// check Local Storage
function checkLocalStorage() {
  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  return todos;
}

// add event to EventListener
// create DIV, grab content from todoInput, add DIV to todoList,
todoButton.addEventListener("click", (e) => {
  e.preventDefault();

  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo");

  addLi(todoDiv);
  saveLocalTodos(todoInput.value); // add to localStorage
  addCompBtn(todoDiv);
  addDelBtn(todoDiv);

  todoList.appendChild(todoDiv); // add div with combo "li button button"
  todoInput.value = "";
});

// add btns functionality
todoList.addEventListener("click", (e) => {
  const btn = e.target;

  if (btn.classList[0] === "trash-btn") {
    const todo = btn.parentElement;
    todo.classList.add("fall");
    removeLocalTodos(todo); // remove todo from LS
    todo.addEventListener("transitionend", () => todo.remove()); //delete div(todo) after transition
  }

  if (btn.classList[0] === "complete-btn") {
    const todo = btn.parentElement;
    todo.classList.toggle("completed");
  }
});

// filter
filterOption.addEventListener("change", (e) => {
  const todos = todoList.childNodes; // LI elements
  todos.forEach((todo) => {
    switch (e.target.value) {
      case "all":
        todo.style.display = "flex";
        break;
      case "completed":
        if (todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
      case "uncompleted":
        if (!todo.classList.contains("completed")) {
          todo.style.display = "flex";
        } else {
          todo.style.display = "none";
        }
        break;
    }
  });
});

// get todos from LocalStorage back to the window after refresh
document.addEventListener("DOMContentLoaded", (e) => {
  let todos = checkLocalStorage();

  todos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    // add todo to innerText from LS
    const newTodo = document.createElement("li");
    newTodo.innerText = todo;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    addCompBtn(todoDiv);
    addDelBtn(todoDiv);

    todoList.appendChild(todoDiv);
  });
});
