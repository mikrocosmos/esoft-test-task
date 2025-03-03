import React, { PropsWithChildren } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddTaskForm } from "@/components/MainPage/form/AddTaskForm.tsx";
import { Priority, Status } from "@/@types/prisma.ts";
import { EditTaskForm } from "@/components/MainPage/form/EditTaskForm.tsx";

interface Props {
  taskId?: number;
  defaultStatus: Status;
  title?: string;
  description?: string;
  priority?: Priority;
  deadline?: Date;
  responsibleId?: number;
  creatorId?: number;
  className?: string;
}

export const TaskModal: React.FC<PropsWithChildren<Props>> = ({
  taskId,
  defaultStatus,
  title,
  description,
  priority,
  deadline,
  responsibleId,
  creatorId,
  className,
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent aria-describedby="">
        <DialogTitle className="text-2xl font-bold">
          {taskId ? "Изменить задачу" : "Добавить задачу"}
        </DialogTitle>
        {taskId ? (
          <EditTaskForm
            id={taskId}
            title={title}
            description={description}
            deadline={deadline}
            priority={priority}
            responsibleId={responsibleId}
            creatorId={creatorId}
            status={defaultStatus}
          />
        ) : (
          <AddTaskForm defaultStatus={defaultStatus} />
        )}
      </DialogContent>
    </Dialog>
  );
};
