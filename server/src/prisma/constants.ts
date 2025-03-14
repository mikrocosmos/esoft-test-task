import { hashSync } from "bcryptjs";
import { Task } from "@prisma/client";

const passwordSalt = 10;
export const users = [
  {
    login: "admin",
    password: hashSync("123456", passwordSalt),
    name: "Алексей",
    surname: "Иванов",
    patronym: "Петрович",
  },
  {
    login: "manager1",
    password: hashSync("123456", passwordSalt),
    name: "Дмитрий",
    surname: "Смирнов",
    patronym: "Александрович",
    supervisorId: 1,
  },
  {
    login: "manager2",
    password: hashSync("123456", passwordSalt),
    name: "Ольга",
    surname: "Кузнецова",
    patronym: "Сергеевна",
    supervisorId: 1,
  },
  {
    login: "worker",
    password: hashSync("123456", passwordSalt),
    name: "Иван",
    surname: "Попов",
    supervisorId: 2,
  },
  {
    login: "worker2",
    password: hashSync("123456", passwordSalt),
    name: "Екатерина",
    surname: "Васильева",
    supervisorId: 2,
  },
  {
    login: "worker3",
    password: hashSync("123456", passwordSalt),
    name: "Сергей",
    surname: "Петров",
    supervisorId: 3,
  },
  {
    login: "worker4",
    password: hashSync("123456", passwordSalt),
    name: "Анна",
    surname: "Соколова",
    supervisorId: 3,
  },
];

export const tasks: Omit<Task, "id" | "createdAt" | "updatedAt">[] = [
  {
    title: "Сделать задачу #1",
    description: "Написать код для задачи #1",
    priority: "LOW",
    status: "TODO",
    creatorId: 1,
    responsibleId: 2,
    deadline: new Date("2025-03-01"),
  },
  {
    title: "Сделать задачу #2",
    description: "Написать код для задачи #2",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    creatorId: 1,
    responsibleId: 3,
    deadline: new Date("2025-03-02"),
  },
  {
    title: "Сделать задачу #3",
    description: "Написать код для задачи #3",
    priority: "HIGH",
    status: "DONE",
    creatorId: 1,
    responsibleId: 3,
    deadline: new Date("2025-03-03"),
  },
  {
    title: "Сделать задачу #4",
    description: "Написать код для задачи #4",
    priority: "MEDIUM",
    status: "CANCELED",
    creatorId: 1,
    responsibleId: 3,
    deadline: new Date("2025-03-04"),
  },
  {
    title: "Сделать задачу #5",
    description: "Написать код для задачи #5",
    priority: "HIGH",
    status: "TODO",
    creatorId: 2,
    responsibleId: 4,
    deadline: new Date("2025-03-05"),
  },
  {
    title: "Сделать задачу #6",
    description: "Написать код для задачи #6",
    priority: "LOW",
    status: "IN_PROGRESS",
    creatorId: 2,
    responsibleId: 5,
    deadline: new Date("2025-03-06"),
  },
  {
    title: "Сделать задачу #7",
    description: "Написать код для задачи #7",
    priority: "HIGH",
    status: "TODO",
    creatorId: 2,
    responsibleId: 5,
    deadline: new Date("2025-03-11"),
  },
  {
    title: "Сделать задачу #8",
    description: "Написать код для задачи #8",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    creatorId: 3,
    responsibleId: 6,
    deadline: new Date("2025-03-12"),
  },
  {
    title: "Сделать задачу #9",
    description: "Написать код для задачи #9",
    priority: "LOW",
    status: "DONE",
    creatorId: 3,
    responsibleId: 6,
    deadline: new Date("2025-03-13"),
  },
  {
    title: "Сделать задачу #10",
    description: "Написать код для задачи #10",
    priority: "HIGH",
    status: "DONE",
    creatorId: 3,
    responsibleId: 7,
    deadline: new Date("2025-03-14"),
  },
  {
    title: "Сделать задачу #11",
    description: "Написать код для задачи #11",
    priority: "MEDIUM",
    status: "CANCELED",
    creatorId: 3,
    responsibleId: 7,
    deadline: new Date("2025-03-15"),
  },
  {
    title: "Сделать задачу #12",
    description: "Написать код для задачи #12",
    priority: "LOW",
    status: "TODO",
    creatorId: 1,
    responsibleId: 2,
    deadline: new Date("2025-03-16"),
  },
  {
    title: "Сделать задачу #13",
    description: "Написать код для задачи #13",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    creatorId: 1,
    responsibleId: 3,
    deadline: new Date("2025-03-17"),
  },
  {
    title: "Сделать задачу #14",
    description: "Написать код для задачи #14",
    priority: "HIGH",
    status: "DONE",
    creatorId: 1,
    responsibleId: 3,
    deadline: new Date("2025-03-18"),
  },
  {
    title: "Сделать задачу #15",
    description: "Написать код для задачи #15",
    priority: "MEDIUM",
    status: "CANCELED",
    creatorId: 1,
    responsibleId: 3,
    deadline: new Date("2025-03-19"),
  },
  {
    title: "Сделать задачу #16",
    description: "Написать код для задачи #16",
    priority: "HIGH",
    status: "TODO",
    creatorId: 2,
    responsibleId: 4,
    deadline: new Date("2025-03-20"),
  },
  {
    title: "Сделать задачу #17",
    description: "Написать код для задачи #17",
    priority: "LOW",
    status: "IN_PROGRESS",
    creatorId: 2,
    responsibleId: 5,
    deadline: new Date("2025-03-21"),
  },
  {
    title: "Сделать задачу #18",
    description: "Написать код для задачи #18",
    priority: "HIGH",
    status: "TODO",
    creatorId: 2,
    responsibleId: 5,
    deadline: new Date("2025-03-22"),
  },
  {
    title: "Сделать задачу #19",
    description: "Написать код для задачи #19",
    priority: "MEDIUM",
    status: "IN_PROGRESS",
    creatorId: 3,
    responsibleId: 6,
    deadline: new Date("2025-03-23"),
  },
  {
    title: "Сделать задачу #20",
    description: "Написать код для задачи #20",
    priority: "LOW",
    status: "DONE",
    creatorId: 3,
    responsibleId: 6,
    deadline: new Date("2025-03-24"),
  },
  {
    title: "Сделать задачу #21",
    description: "Написать код для задачи #21",
    priority: "HIGH",
    status: "DONE",
    creatorId: 3,
    responsibleId: 7,
    deadline: new Date("2025-03-25"),
  },
  {
    title: "Сделать задачу #22",
    description: "Написать код для задачи #22",
    priority: "MEDIUM",
    status: "CANCELED",
    creatorId: 3,
    responsibleId: 7,
    deadline: new Date("2025-03-26"),
  },
];
