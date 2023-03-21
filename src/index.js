const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers;

  const user = users.find((item) => item.username === username);
  const index = users.findIndex((item) => item.username === username);

  if (user && index >= 0) {
    request.user = user;
    request.index = index;

    next();
  }

  return response.status(404).send({
    error: "Mensagem do erro",
  });
}

app.post("/users", (request, response) => {
  // Complete aqui

  const { name, username } = request.body;

  const userAlreadyExists = users.find((item) => item.username === username);
  if (userAlreadyExists) {
    return response.status(400).json({
      error: "Mensagem do erro",
    });
  }

  const user = {
    name,
    username,
    id: uuidv4(),
    todos: [],
  };

  users.push(user);

  return response.status(201).send(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const user = request.user;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const { title, deadline } = request.body;
  const index = request.index;
  const user = request.user;

  const todo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline).toISOString(),
    created_at: new Date().toISOString(),
  };

  user.todos.push(todo);

  users[index] = user;

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const index = request.index;
  const user = request.user;
  const { id } = request.params;

  let indexTodo = false;

  const todos = user.todos.map((item, index) => {
    if (item.id === id) {
      indexTodo = index;
      return {
        ...item,
        title,
        deadline: new Date(deadline),
      };
    }
    return item;
  });

  if (indexTodo === false) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  user.todos = todos;

  users[index] = user;

  return response.status(201).json(users[index].todos[indexTodo]);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui

  const index = request.index;
  const user = request.user;
  const { id } = request.params;

  let indexTodo = false;

  const todos = user.todos.map((item, index) => {
    if (item.id === id) {
      indexTodo = index;
      return {
        ...item,
        done: true,
      };
    }
    return item;
  });
  
  if (indexTodo === false) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  user.todos = todos;

  users[index] = user;

  return response.status(201).json(todos[indexTodo]);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const user = request.user;
  const { id } = request.params;

  const todo = user.todos.find((item) => item.id === id);

  if (!todo) {
    return response.status(404).json({ error: "Mensagem do erro" });
  }

  const todos = user.todos.filter((item) => item.id !== id);

  user.todos = todos;

  return response.status(204).send();
});

module.exports = app;
