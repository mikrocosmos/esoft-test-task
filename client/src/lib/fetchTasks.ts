import { ITask, Status } from "@/@types/prisma.ts";
import axios from "axios";
import { serverAddress } from "@/constants/serverAddress.ts";

export async function fetchTasks(
  userId: number,
  status: Status,
  groupBy?: string,
  responsibleId?: number,
) {
  const { data } = await axios.get<ITask[]>(
    `${serverAddress}/tasks?status=${status}&userId=${userId}&groupBy=${groupBy}&responsibleId=${responsibleId}`,
  );
  return data;
}
