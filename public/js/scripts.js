/* DOMContentLoaded */
document.addEventListener("DOMContentLoaded", async () => {
  // theme-switcher
  await fetch('/api/v1/todos', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(data => data.json())
  .then(data => {
    localStorage.setItem("todos", JSON.stringify(data.data));
    console.log(data)
  })
  document
    .getElementById("theme-switcher")
    .addEventListener("click", function () {
      document.querySelector("body").classList.toggle("light");
      const themeImg = this.children[0];
      themeImg.setAttribute(
        "src",
        themeImg.getAttribute("src") === "../../public/assets/images/icon-sun.svg"
          ? "../../public/assets/images/icon-moon.svg"
          : "../../public/assets/images/icon-sun.svg"
      );
    });
  // get alltodos and initialise listeners
  addTodo();
  // dragover on .todos container
  document.querySelector(".todos").addEventListener("dragover", function (e) {
    e.preventDefault();
    if (
      !e.target.classList.contains("dragging") &&
      e.target.classList.contains("card")
    ) {
      const draggingCard = document.querySelector(".dragging");
      const cards = [...this.querySelectorAll(".card")];
      const currPos = cards.indexOf(draggingCard);
      const newPos = cards.indexOf(e.target);
      console.log(currPos, newPos);
      if (currPos > newPos) {
        this.insertBefore(draggingCard, e.target);
      } else {
        this.insertBefore(draggingCard, e.target.nextSibling);
      }
      const todos = JSON.parse(localStorage.getItem("todos"));
      const removed = todos.splice(currPos, 1);
      todos.splice(newPos, 0, removed[0]);
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  });
  // add new todos on user input
  const add = document.getElementById("add-btn");
  const txtInput = document.querySelector(".txt-input");
  add.addEventListener("click", async function () {
    const item = !txtInput.value ? '#' : txtInput.value.trim();
    await fetch('/api/v1/todos/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ item: item}),
    })
    .then(data => data.json())
    .then(data => {
      console.log(data)
        txtInput.value = "";
        const todos = !localStorage.getItem("todos")
          ? []
          : JSON.parse(localStorage.getItem("todos"));
        const currentTodo = {
          _id: data.data._id,
          item: data.data.item,
          isCompleted: data.data.isCompleted,
        };
        addTodo([currentTodo]);
        todos.push(currentTodo);
        localStorage.setItem("todos", JSON.stringify(todos));
      txtInput.focus();
    })
  });
  // add todo also on enter key event
  txtInput.addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
      add.click();
    }
  });
  // filter todo - all, active, completed
  document.querySelector(".filter").addEventListener("click", function (e) {
    const id = e.target.id;
    if (id) {
      document.querySelector(".on").classList.remove("on");
      document.getElementById(id).classList.add("on");
      document.querySelector(".todos").className = `todos ${id}`;
    }
  });
  // clear completed
  document
    .getElementById("clear-completed")
    .addEventListener("click", function () {
      deleteIndexes = [];
      document.querySelectorAll(".card.checked").forEach(function (card) {
        deleteIndexes.push(
          [...document.querySelectorAll(".todos .card")].indexOf(card)
        );
        card.classList.add("fall");
        card.addEventListener("animationend", function (e) {
          setTimeout(function () {
            card.remove();
          }, 100);
        });
      });
      removeManyTodo(deleteIndexes);
    });
});


/* stateTodo() FUNCTION TO UPDATE TODO ABOUT COMPLETION */

function stateTodo(index, completed) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  todos[index].isCompleted = completed;
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* removeManyTodo() FUNCTION TO REMOVE ONE TODO */

async function removeTodo(index, id) {
  const todos = JSON.parse(localStorage.getItem("todos"));
  await fetch(`/api/v1/todos/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
  }).then(data => data.json())
  .then(data => {
    todos.splice(index, 1);
    localStorage.setItem("todos", JSON.stringify(todos));
  })
}

/* removeManyTodo FUNCTION TO REMOVE MANY TODOS */

function removeManyTodo(indexes) {
  let todos = JSON.parse(localStorage.getItem("todos"));
  todos = todos.filter(function (todo, index) {
    return !indexes.includes(index);
  });
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* addTodo() FUNCTION TO LIST/CREATE TODOS AND ADD EVENT LISTENERS */

function addTodo(todos = JSON.parse(localStorage.getItem("todos"))) {
  if (!todos) {
    return null;
  }
  const itemsLeft = document.getElementById("items-left");
  // create cards
  todos.forEach(function (todo) {
    console.log(todo)
    const card = document.createElement("li");
    const cbContainer = document.createElement("div");
    const cbInput = document.createElement("input");
    const check = document.createElement("span");
    const item = document.createElement("p");
    const button = document.createElement("button");
    const img = document.createElement("img");
    // Add classes
    card.classList.add("card");
    card.setAttribute('data-id', todo._id)
    button.classList.add("clear");
    cbContainer.classList.add("cb-container");
    cbInput.classList.add("cb-input");
    item.classList.add("item");
    check.classList.add("check");
    button.classList.add("clear");
    // Set attributes
    card.setAttribute("draggable", true);
    img.setAttribute("src", "../../public/assets/images/icon-cross.svg");
    img.setAttribute("alt", "Clear it");
    cbInput.setAttribute("type", "checkbox");
    // set todo item for card
    item.textContent = todo.item;
    // if completed -> add respective class / attribute
    if (todo.isCompleted) {
      card.classList.add("checked");
      cbInput.setAttribute("checked", "checked");
    }
    // Add drag listener to card
    card.addEventListener("dragstart", function () {
      this.classList.add("dragging");
    });
    card.addEventListener("dragend", function () {
      this.classList.remove("dragging");
    });
    // Add click listener to checkbox
    cbInput.addEventListener("click", async function () {
      const correspondingCard = this.parentElement.parentElement;
      const checked = this.checked;
      const id = card.getAttribute('data-id');
      await fetch(`/api/v1/todos/${id}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: checked}),
      })
      .then(data => {
        stateTodo(
          [...document.querySelectorAll(".todos .card")].indexOf(
            correspondingCard
          ),
          checked
        );
        checked
          ? correspondingCard.classList.add("checked")
          : correspondingCard.classList.remove("checked");
        itemsLeft.textContent = document.querySelectorAll(
          ".todos .card:not(.checked)"
        ).length;
      })
    });
    // Add click listener to clear button
    button.addEventListener("click", function () {
      const correspondingCard = this.parentElement;
      const getID = card.getAttribute('data-id');
      correspondingCard.classList.add("fall");
      removeTodo(
        [...document.querySelectorAll(".todos .card")].indexOf(
          correspondingCard
        ),
        getID
      );
      correspondingCard.addEventListener("animationend", function () {
        setTimeout(function () {
          correspondingCard.remove();
          itemsLeft.textContent = document.querySelectorAll(
            ".todos .card:not(.checked)"
          ).length;
        }, 100);
      });
    });
    // parent.appendChild(child)
    button.appendChild(img);
    cbContainer.appendChild(cbInput);
    cbContainer.appendChild(check);
    card.appendChild(cbContainer);
    card.appendChild(item);
    card.appendChild(button);
    document.querySelector(".todos").appendChild(card);
  });
  // Update itemsLeft
  itemsLeft.textContent = document.querySelectorAll(
    ".todos .card:not(.checked)"
  ).length;
}
