import { prisma } from "../prisma/prisma-client";
import { compare } from "bcryptjs";
import { signJWT } from "../utils/signJWT";
import jwt from "jsonwebtoken";

export async function loginRoute(login: string, password: string) {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        login,
      },
    });

    if (!findUser) {
      return {
        success: false,
        status: 404,
        message: "Такого пользователя не существует",
      };
    }

    const isPasswordCorrect = await compare(password, findUser.password);

    if (!isPasswordCorrect) {
      return {
        success: false,
        status: 401,
        message: "Неверный пароль",
      };
    }

    const token = signJWT(findUser.login);

    return {
      success: true,
      status: 200,
      message: "Успешный вход",
      token,
    };
  } catch (error) {
    console.error("[loginRoute]", error);
    return {
      success: false,
      status: 500,
      message: "Внутренняя ошибка сервера",
    };
  }
}
