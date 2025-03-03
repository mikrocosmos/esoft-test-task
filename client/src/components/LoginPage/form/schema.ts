import { z } from "zod";

export const loginFormSchema = z.object({
  login: z.string().min(2, "Логин должен быть длиннее 2 символов"),
  password: z.string().min(6, "Пароль должен быть длиннее 6 символов"),
});

export type TLoginFormSchema = z.infer<typeof loginFormSchema>;
