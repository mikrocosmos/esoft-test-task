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
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://esoft-test-task-frontend.vercel.app",
    ],
  }),
);
const jsonParser = bodyParser.json();

app.get("/api/me", jsonParser, async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(["GET /me"], err);
    res.status(500).send({
      success: false,
      message: "[GET /me] Error",
    });
  }
});

app.get("/api/tasks", async (req: Request, res: Response) => {
  try {
    const { status, userId, groupBy, responsibleId } = req.query;

    const tasks = await getTasks(
      status as Status,
      Number(userId),
      String(groupBy),
      Number(responsibleId),
    );

    res.status(200).send(tasks);
  } catch (err) {
    console.error(["GET /tasks"], err);
    res.status(500).send({
      success: false,
      message: "[GET /tasks] Error",
    });
  }
});

app.get("/api/tasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await getTask(+id);
    res.status(200).send(task);
  } catch (err) {
    console.error(["GET /tasks/:id"], err);
    res.status(500).send({
      success: false,
      message: "[GET /tasks/:id] Error",
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(["GET /users/:id"], err);
    res.status(500).send({
      success: false,
      message: "[GET /users/:id] Error",
    });
  }
});

app.post("/api/tasks", jsonParser, async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(["POST /tasks"], err);
    res.status(500).send({
      success: false,
      message: "[POST /tasks] Error",
    });
  }
});

app.post("/api/login", jsonParser, async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(["POST /login"], err);
    res.status(500).send({
      success: false,
      message: "[POST /login] Error",
    });
  }
});

app.post("/api/register", jsonParser, async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(["POST /register"], err);
    res.status(500).send({
      success: false,
      message: "[POST /register] Error",
    });
  }
});

app.put("/api/tasks/:id", jsonParser, async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error(["PUT /tasks/:id"], err);
    res.status(500).send({
      success: false,
      message: "[PUT /tasks/:id] Error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
