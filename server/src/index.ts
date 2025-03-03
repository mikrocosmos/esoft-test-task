import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { loginRoute } from "./routes/login.route";
import { getSession } from "./routes/session.route";
import { register } from "./routes/register.route";
import { Status } from "@prisma/client";
import { createTask, editTask, getTask, getTasks } from "./routes/tasks.route";
import { getUserSubordinates } from "./routes/users.route";

const app: Express = express();
app.use(cors());

const jsonParser = bodyParser.json();

app.get("/me", jsonParser, async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({
      success: false,
      message: "Нет токена",
    });
    return;
  }

  const user = await getSession(token);

  res.status(200).send(user);
});

app.get("/tasks", async (req: Request, res: Response) => {
  const { status, userId, groupBy, responsibleId } = req.query;

  const tasks = await getTasks(
    status as Status,
    Number(userId),
    String(groupBy),
    Number(responsibleId),
  );

  res.status(200).send(tasks);
});

app.get("/tasks/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const task = await getTask(+id);
  res.status(200).send(task);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { subordinates } = req.query;
  if (subordinates) {
    const subs = await getUserSubordinates(+id);
    if (!subs) {
      res.status(204).send({
        success: true,
        message: "У пользователя нет подчинённых",
      });
    }
    res.status(200).send(subs);
    return;
  }
});

app.post("/tasks", jsonParser, async (req: Request, res: Response) => {
  const {
    title,
    description,
    priority,
    status,
    creatorId,
    responsibleId,
    deadline,
  } = req.body;

  const task = await createTask(
    title,
    priority,
    status,
    creatorId,
    deadline,
    description,
    Number(responsibleId),
  );

  res.status(201).send({
    success: true,
    message: "Задача успешно создана",
    task,
  });
});

app.post("/login", jsonParser, async (req: Request, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).send({
      success: false,
      message: "Некорректные данные",
    });
  }

  const result = await loginRoute(login, password);

  res.status(result.status).json({
    success: result.success,
    message: result.message,
    token: result.token,
  });
});

app.post("/register", jsonParser, async (req: Request, res: Response) => {
  const { login, password, name, surname, patronym, supervisorId } = req.body;

  if (!login || !password || !name || !surname) {
    res.status(400).send({
      success: false,
      message: "Некорректные данные",
    });
  }

  const result = await register({
    login,
    password,
    name,
    surname,
    patronym,
    supervisorId,
  });

  res.status(result.status).json({
    success: result.success,
    message: result.message,
    token: result.token,
  });
});

app.put("/tasks/:id", jsonParser, async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    priority,
    status,
    creatorId,
    responsibleId,
    deadline,
  } = req.body;

  try {
    const task = await editTask(
      +id,
      title,
      description,
      priority,
      status,
      +creatorId,
      +responsibleId,
      deadline,
    );
    res.status(200).send(task);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "[PUT /tasks/:id] Error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
