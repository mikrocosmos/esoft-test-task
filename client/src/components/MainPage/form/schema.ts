import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "Заголовок не может быть пустым"),
  description: z.string().min(1, "Описание не может быть пустым"),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  deadline: z.date(),
  creatorId: z.number(),
  responsibleId: z.string().optional(),
});

export type TTaskSchema = z.infer<typeof taskSchema>;
