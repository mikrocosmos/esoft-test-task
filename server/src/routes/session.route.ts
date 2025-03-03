import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma-client";

export async function getSession(token: string) {
  const login = jwt.verify(
    token.split(" ")[1],
    process.env.JWT_SECRET ?? "secret",
  );

  const findUser = await prisma.user.findUnique({
    where: {
      login: login as string,
    },
    select: {
      id: true,
      login: true,
      name: true,
      surname: true,
      patronym: true,
      password: false,
    },
  });

  if (!findUser) {
    return null;
  }

  return findUser;
}
