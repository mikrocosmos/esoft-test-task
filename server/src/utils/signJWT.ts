import jwt from "jsonwebtoken";

export const signJWT = (login: string) => {
  return jwt.sign(login, process.env.JWT_SECRET ?? "secret");
};
