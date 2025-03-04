import React from "react";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { taskSchema, TTaskSchema } from "@/components/MainPage/form/schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/LoginPage/Field.tsx";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ITask, Priority, Session, Status } from "@/@types/prisma.ts";
import { cn } from "@/lib/utils.ts";
import { DatePickerForm } from "@/components/MainPage/form/DatePicker.tsx";
import { FormTextarea } from "@/components/MainPage/form/FormTextarea.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { statusMap } from "@/constants/statusMap.ts";
import { priorityMap } from "@/constants/priorityMap.ts";
import { Button } from "@/components/ui/button.tsx";
import axios from "axios";
import { DialogClose } from "@/components/ui/dialog.tsx";
import { fetchSubordinates } from "@/lib/fetchSubordinates.ts";
import { serverAddress } from "@/constants/serverAddress.ts";

interface Props {
  id: number;
  title?: string;
  description?: string;
  priority?: Priority;
  deadline?: Date;
  responsibleId?: number;
  creatorId?: number;
  status: Status;
  className?: string;
}

export const EditTaskForm: React.FC<Props> = ({
  id,
  title,
  description,
  priority,
  deadline,
  responsibleId,
  creatorId,
  status,
  className,
}) => {
  const [openDeleteConfirm, setOpenDeleteConfirm] = React.useState(false);
  deadline = new Date(String(deadline));

  const user = useQuery<Session>("user");

  const editTask = async (data: TTaskSchema) => {
    const { data: editedTask } = await axios.put<ITask>(
      `${serverAddress}/tasks/${id}`,
      data,
    );
    return editedTask;
  };

  if (!user.data) {
    return <div>Загрузка...</div>;
  }

  const queryClient = useQueryClient();
  const { mutate } = useMutation((task: TTaskSchema) => editTask(task), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const isCreator = user.data.id === creatorId;

  const form = useForm<TTaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title,
      description,
      deadline,
      priority,
      responsibleId: String(responsibleId),
      status,
      creatorId,
    },
  });

  const subordinates = useQuery(
    "subordinates",
    async () => fetchSubordinates(user.data?.id),
    {
      keepPreviousData: true,
    },
  );
  if (!subordinates.data) {
    return <div>Загрузка...</div>;
  }

  const onSubmit = (data: TTaskSchema) => {
    try {
      mutate(data);
    } catch (error) {
      console.error("Не удалось добавить задачу:", error);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`${serverAddress}/tasks/${id}`);
      queryClient.invalidateQueries(["tasks"]);
    } catch (error) {
      console.error("Не удалось удалить задачу:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isCreator ? (
          <FormField
            name="title"
            render={({ field }) => (
              <Field
                {...field}
                name="title"
                placeholder="Заголовок задачи"
                label="Заголовок"
              />
            )}
          />
        ) : (
          <h3 className="text-lg font-semibold">{title}</h3>
        )}

        {isCreator ? (
          <FormField
            name="description"
            render={({ field }) => (
              <FormTextarea
                {...field}
                placeholder="Описание задачи"
                label="Описание"
              />
            )}
          />
        ) : (
          <p>{description}</p>
        )}

        {isCreator ? (
          <DatePickerForm name="deadline" />
        ) : (
          <p>Выполнить до {deadline.toLocaleDateString()}</p>
        )}
        {form.formState.errors.deadline && (
          <p className="text-red-400 text-sm">Дата не может быть пустой</p>
        )}
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <Select
              onValueChange={(e) => field.onChange(e)}
              defaultValue={status}
            >
              <p className="font-semibold text-lg">Статус</p>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите статус" />
              </SelectTrigger>
              <SelectContent>
                {Array.from(statusMap.entries()).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />

        {isCreator ? (
          <FormField
            name="priority"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={(e) => field.onChange(e)}
                defaultValue={field.value}
              >
                <p className="font-semibold text-lg">Приоритет</p>
                <SelectTrigger
                  className={`w-full ${form.formState.errors.priority && "border-red-400"}`}
                >
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(priorityMap.entries()).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <p>Приоритет: {priorityMap.get(priority!)}</p>
        )}

        {isCreator ? (
          <FormField
            name="responsibleId"
            control={form.control}
            render={({ field }) => (
              <Select
                onValueChange={(e) => field.onChange(e)}
                defaultValue={field.value}
              >
                <p className="font-semibold text-lg">Ответственный</p>
                <SelectTrigger
                  className={`w-full ${form.formState.errors.responsibleId && "border-red-400"}`}
                >
                  <SelectValue placeholder="Выберите ответственного" />
                </SelectTrigger>
                <SelectContent>
                  {[user.data, ...subordinates.data.subordinates].map(
                    (user: Session) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.surname} {user.name} {user.patronym}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
        ) : (
          <p>
            Ответственный: {user.data.surname} {user.data.name}
          </p>
        )}
        <div className="flex gap-4 w-full justify-between">
          <Button
            onClick={() => setOpenDeleteConfirm(!openDeleteConfirm)}
            type="button"
            className="bg-transparent w-full text-white border-2 border-white hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            Удалить
          </Button>
          {form.formState.isValid ? (
            <DialogClose asChild>
              <Button
                type="submit"
                className="hover:bg-accent hover:text-white w-full"
              >
                Сохранить
              </Button>
            </DialogClose>
          ) : (
            <Button
              type="submit"
              className="hover:bg-accent hover:text-white w-full"
            >
              Сохранить
            </Button>
          )}
        </div>
        {openDeleteConfirm && (
          <div>
            <p>Вы точно хотите удалить задачу? Это действие необратимо</p>
            <div className="flex gap-4 items-center mt-2">
              <DialogClose asChild>
                <Button
                  onClick={onDelete}
                  className="bg-transparent text-white border-2 border-white hover:bg-red-500 hover:text-white hover:border-red-500"
                >
                  Да
                </Button>
              </DialogClose>
              <Button
                onClick={() => setOpenDeleteConfirm(false)}
                className="hover:bg-accent hover:text-white"
              >
                Нет
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
