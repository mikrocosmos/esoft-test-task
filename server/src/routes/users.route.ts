import { prisma } from "../prisma/prisma-client";

export async function getUserSubordinates(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      subordinates: {
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
}
