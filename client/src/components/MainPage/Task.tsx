import React from "react";
import { cn } from "@/lib/utils.ts";
import { ITask } from "@/@types/prisma.ts";
import { statusMap } from "@/constants/statusMap.ts";
import { priorityMap } from "@/constants/priorityMap.ts";
import { TaskModal } from "@/components/MainPage/TaskModal.tsx";

interface Props extends ITask {
  className?: string;
}

export const Task: React.FC<Props> = ({
  id,
  status,
  title,
  priority,
  deadline,
  responsible,
  responsibleId,
  description,
  creatorId,
  className,
}: Props) => {
  function getStatusClass() {
    if (status === "DONE") {
      return "text-green-500";
    }
    if (deadline && new Date(deadline) < new Date()) {
      return "text-red-500";
    }
    return "text-gray-300";
  }

  return (
    <TaskModal
      taskId={id}
      title={title}
      creatorId={creatorId}
      priority={priority}
      deadline={deadline}
      description={description}
      responsibleId={responsibleId}
      defaultStatus={status}
    >
      <div
        className={cn(
          "bg-popover text-white p-4 rounded-md shadow-xl cursor-pointer transition hover:bg-card hover:text-white hover:-translate-y-1",
          className,
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn("font-semibold text-lg", getStatusClass())}>
            {title}
          </h3>
          <div className="flex items-center">
            {Array.from({
              length:
                Array.from(priorityMap).findIndex((p) => p[0] === priority) + 1,
            })
              .fill(null)
              .map((_, index) => (
                <span key={index} className="font-bold">
                  !
                </span>
              ))}
          </div>
        </div>

        <hr className="h-px w-full bg-neutral-500 border-0 mb-2" />

        {deadline && (
          <p>Выполнить до {new Date(deadline).toLocaleDateString("ru")}</p>
        )}
        <p>
          {responsible?.name} {responsible?.surname}
        </p>
        <p>{statusMap.get(status)}</p>
      </div>
    </TaskModal>
  );
};
