import React from "react";
import { Form, FormField } from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { taskSchema, TTaskSchema } from "@/components/MainPage/form/schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/LoginPage/Field.tsx";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ITask, Session, Status } from "@/@types/prisma.ts";
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
  defaultStatus: Status;
  className?: string;
}

export const AddTaskForm: React.FC<Props> = ({ className, defaultStatus }) => {
  const user = useQuery<Session>("user");

  if (!user.data) {
    return <div>Загрузка...</div>;
  }

  const subordinates = useQuery(
    "subordinates",
    async () => fetchSubordinates(user.data?.id),
    {
      keepPreviousData: true,
    },
  );

  const form = useForm<TTaskSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: defaultStatus,
      creatorId: user.data.id,
      deadline: new Date(),
    },
  });

  const createTask = async (task: TTaskSchema) => {
    const { data } = await axios.post<ITask>(`${serverAddress}/tasks`, task);
    return data;
  };

  const queryClient = useQueryClient();
  const { mutate } = useMutation((task: TTaskSchema) => createTask(task), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
    },
  });

  const onSubmit = (data: TTaskSchema) => {
    try {
      mutate(data);
    } catch (error) {
      console.error("Не удалось добавить задачу:", error);
    }
  };

  if (!subordinates.data) {
    return <div>Загрузка...</div>;
  }

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-4", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
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

        <DatePickerForm name="deadline" />
        {form.formState.errors.deadline && (
          <p className="text-red-400 text-sm">Дата не может быть пустой</p>
        )}
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <Select
              onValueChange={(e) => field.onChange(e)}
              defaultValue={defaultStatus}
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
        <FormField
          name="priority"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={(e) => field.onChange(e)}>
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
        <FormField
          name="responsibleId"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={(e) => field.onChange(e)}>
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
        {form.formState.isValid ? (
          <DialogClose asChild>
            <Button type="submit" className="hover:bg-accent hover:text-white">
              Добавить задачу
            </Button>
          </DialogClose>
        ) : (
          <Button type="submit" className="hover:bg-accent hover:text-white">
            Добавить задачу
          </Button>
        )}
      </form>
    </Form>
  );
};
