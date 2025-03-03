import { ITask, Status } from "@/@types/prisma.ts";
import axios from "axios";

export async function fetchTasks(
  userId: number,
  status: Status,
  groupBy?: string,
  responsibleId?: number,
) {
  const { data } = await axios.get<ITask[]>(
    `http://localhost:3000/tasks?status=${status}&userId=${userId}&groupBy=${groupBy}&responsibleId=${responsibleId}`,
  );
  return data;
}
