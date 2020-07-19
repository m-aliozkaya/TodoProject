const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {
  form.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
  secondCardBody.addEventListener("click", deleteTodo);
  filter.addEventListener("keyup", filterTodos);
  clearButton.addEventListener("click", clearTodos);
}

function clearTodos() {
  if (confirm("Todolarin hepsini temizlemek istediginize emin misiniz")) {
    while (todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }

    localStorage.removeItem("todos");
  }
}

function filterTodos(e) {
  const filterInput = e.target.value.toLowerCase();

  const listItems = document.querySelectorAll(".list-group-item");

  listItems.forEach(function (item) {
    const text = item.textContent.toLowerCase();

    if (text.indexOf(filterInput) === -1) {
      item.setAttribute("style", "display : none !important");
    } else {
      item.setAttribute("style", "display :block");
    }
  });
}

function deleteTodo(e) {
  if (e.target.className === "fa fa-remove") {
    e.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
    showAlert("success", "Todo basariyla silindi");
  }
}

function deleteTodoFromStorage(deletetodo) {
  let todos = getTodosFromStorage();

  todos.forEach(function (todo, index) {
    if (todo === deletetodo) {
      todos.splice(index, 1);
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach((e) => {
    addTodoToUI(e);
  });
}

function addTodo(e) {

  const newTodo = todoInput.value.trim();

  const uygun = uygunMu(newTodo);

  if (uygun){
    addTodoToUI(newTodo);
    addTodoToLocalStorage(newTodo);
    showAlert("success", "Todo başarılı bir şekilde eklendi.");
  }

  e.preventDefault();
}

function uygunMu(newTodo) {
 
  if (newTodo === "") {
    showAlert("danger", "Lütfen bir todo giriniz!");
    return false;
  } else {
    
    const todos = getTodosFromStorage();

    for(todo of todos){
      if(newTodo === todo){
        showAlert("warning","Lütfen olmayan bir todo giriniz!");
        return false;
      }
    }

  }

  return true;
}

function getTodosFromStorage() {
  let todos;

  if (localStorage.getItem("todos") === null) {
    todos = [];
  } else {
    todos = JSON.parse(localStorage.getItem("todos"));
  }

  return todos;
}

function addTodoToLocalStorage(newTodo) {
  let todos = getTodosFromStorage();

  todos.push(newTodo);

  localStorage.setItem("todos", JSON.stringify(todos));
}

function showAlert(type, message) {
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;

  if (firstCardBody.contains(document.querySelector(".alert"))) {
  } else {
    firstCardBody.appendChild(alert);
  }

  setTimeout(function () {
    alert.remove();
  }, 1500);
}

function addTodoToUI(newTodo) {
  const listItem = document.createElement("li");
  const link = document.createElement("a");
  link.href = "#";
  link.className = "delete-item";
  link.innerHTML = "<i class='fa fa-remove'></i>";

  listItem.className = "list-group-item d-flex justify-content-between";
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  todoList.appendChild(listItem);
  todoInput.value = "";
}
