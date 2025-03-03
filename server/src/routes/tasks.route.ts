import { prisma } from "../prisma/prisma-client";
import { Priority, Status } from "@prisma/client";

export async function getTasks(
  status?: Status,
  userId?: number,
  groupBy?: string,
  responsibleId?: number,
) {
  const include = {
    creator: {
      select: {
        id: true,
        login: true,
        name: true,
        surname: true,
        patronym: true,
        password: false,
      },
    },
    responsible: {
      select: {
        id: true,
        login: true,
        name: true,
        surname: true,
        patronym: true,
        password: false,
      },
    },
  };

  const baseWhere = {
    status,
    OR: [{ responsibleId: userId }, { creatorId: userId }],
  };

  const deadlineFilter = {
    today: { lte: new Date() },
    week: { lte: new Date(new Date().setDate(new Date().getDate() + 7)) },
    future: { gte: new Date(new Date().setDate(new Date().getDate() + 7)) },
    all: {},
  };

  const where = responsibleId
    ? { status, responsibleId }
    : {
        ...baseWhere,
        deadline: groupBy
          ? deadlineFilter[groupBy as keyof typeof deadlineFilter]
          : undefined,
      };

  if (responsibleId && groupBy) {
    return prisma.task.findMany({
      where: {
        responsibleId,
        deadline: deadlineFilter[groupBy as keyof typeof deadlineFilter],
        status,
      },
      orderBy: { updatedAt: "desc" },
      include,
    });
  }

  return prisma.task.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include,
  });
}

export async function getTask(id: number) {
  const findTask = await prisma.task.findUnique({
    where: {
      id,
    },
    include: {
      creator: {
        select: {
          id: true,
          login: true,
          name: true,
          surname: true,
          patronym: true,
          password: false,
        },
      },
      responsible: {
        select: {
          id: true,
          login: true,
          name: true,
          surname: true,
          patronym: true,
          password: false,
        },
      },
    },
  });

  if (!findTask) {
    return {
      success: false,
      message: "Задача не найдена",
      status: 404,
    };
  }

  return findTask;
}

export async function createTask(
  title: string,
  priority: Priority,
  status: Status,
  creatorId: number,
  deadline: Date,
  description?: string,
  responsibleId?: number,
) {
  try {
    return prisma.task.create({
      data: {
        title,
        description,
        priority,
        status,
        creatorId,
        responsibleId,
        deadline,
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function editTask(
  id: number,
  title?: string,
  description?: string,
  priority?: Priority,
  status?: Status,
  creatorId?: number,
  responsibleId?: number,
  deadline?: Date,
) {
  const findTask = await prisma.task.findFirst({
    where: { id },
  });
  if (!findTask) {
    return {
      success: false,
      message: "Задача не найдена",
      status: 404,
    };
  }
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      title,
      description,
      priority,
      status,
      creatorId,
      responsibleId,
      deadline,
    },
  });
}
