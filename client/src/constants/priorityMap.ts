import { Priority } from "@/@types/prisma.ts";

export const priorityMap = new Map<Priority, string>([
  ["LOW", "Низкий"],
  ["MEDIUM", "Средний"],
  ["HIGH", "Высокий"],
]);
