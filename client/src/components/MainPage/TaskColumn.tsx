import React from "react";
import { useQuery } from "react-query";
import { Status } from "@/@types/prisma.ts";
import { cn } from "@/lib/utils.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { TaskModal } from "@/components/MainPage/TaskModal.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Plus } from "lucide-react";
import { Task } from "./Task";
import { fetchTasks } from "@/lib/fetchTasks";

interface Props {
  userId: number;
  className?: string;
  status: Status;
  statusName: string;
  groupBy: string;
  responsibleId?: number;
}

export const TaskColumn: React.FC<Props> = ({
  userId,
  className,
  status,
  statusName,
  groupBy,
  responsibleId,
}) => {
  const { data, isLoading, isError } = useQuery(
    ["tasks", status, userId, groupBy, responsibleId],
    async () => await fetchTasks(userId, status, groupBy, responsibleId),
    {
      keepPreviousData: true,
    },
  );

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <h2 className="font-semibold text-2xl">{statusName}</h2>
      <div className="mt-4">
        <TaskModal defaultStatus={status}>
          <Button className="w-full mb-4 duration-300 hover:bg-accent hover:text-white">
            <Plus size={20} />
            Добавить задачу
          </Button>
        </TaskModal>
        {isLoading ? (
          <Skeleton className="w-full h-[400px]" />
        ) : data && data.length > 0 ? (
          <div className="flex flex-col gap-4">
            {data.map((task) => (
              <Task key={task.id} {...task} />
            ))}
          </div>
        ) : (
          <p>Нет задач в этом статусе</p>
        )}
        {isError && <p>Произошла ошибка</p>}
      </div>
    </div>
  );
};
