import { Status } from "@/@types/prisma";

export const statusMap = new Map<Status, string>([
  ["TODO", "К выполнению"],
  ["IN_PROGRESS", "Выполняется"],
  ["DONE", "Выполнена"],
  ["CANCELED", "Отменена"],
]);
