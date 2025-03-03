import { prisma } from "../prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { loginRoute } from "./login.route";

interface UserData {
  login: string;
  password: string;
  name: string;
  surname: string;
  patronym?: string;
  supervisorId?: number;
}

export async function register(userData: UserData) {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        login: userData.login,
      },
    });

    if (findUser) {
      return {
        success: false,
        status: 400,
        message: "Пользователь с таким логином уже существует",
      };
    }

    await prisma.user.create({
      data: {
        login: userData.login,
        password: hashSync(userData.password, 9),
        name: userData.name,
        surname: userData.surname,
        patronym: userData.patronym,
        supervisorId: userData.supervisorId,
      },
    });

    const { token } = await loginRoute(userData.login, userData.password);

    return {
      success: true,
      status: 200,
      message: "Пользователь успешно зарегистрирован",
      token,
    };
  } catch (error) {
    console.error("[registerRoute]", error);
    return {
      success: false,
      status: 500,
      message: "Произошла ошибка при регистрации пользователя",
    };
  }
}
