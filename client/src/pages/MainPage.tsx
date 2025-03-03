import { Status } from "@/@types/prisma.ts";
import { Container } from "@/components/Container.tsx";
import { TaskColumn } from "@/components/MainPage/TaskColumn.tsx";
import { useNavigate } from "react-router";
import LogOutButton from "@/components/MainPage/LogOutButton";
import { getUserSession } from "@/lib/getUserSession.ts";
import { useQuery } from "react-query";
import { GroupBySelect } from "@/components/MainPage/GroupBySelect.tsx";
import React from "react";
import { ResponsibleSelect } from "@/components/MainPage/ResponsibleSelect.tsx";

function MainPage() {
  const statusMap = new Map<Status, string>([
    ["TODO", "К выполнению"],
    ["IN_PROGRESS", "Выполняются"],
    ["DONE", "Выполнены"],
    ["CANCELED", "Отменены"],
  ]);
  const [groupBy, setGroupBy] = React.useState<string>("all");
  const [responsibleId, setResponsibleId] = React.useState<number>(0);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const userSession = await getUserSession();
    if (!userSession) {
      navigate("/login");
      return;
    }
    return userSession;
  };

  const user = useQuery("user", fetchUser);

  if (!user.data) {
    return <div>Загрузка...</div>;
  }

  return (
    <Container className="mt-8">
      <header className="flex justify-between">
        <h1 className="text-3xl font-bold">Задачи</h1>
        <div className="flex items-center">
          <p className="mr-4">
            {user.data.name} {user.data.surname}
          </p>
          <LogOutButton />
        </div>
      </header>
      <div className="flex items-center gap-5">
        <GroupBySelect
          setGroupBy={setGroupBy}
          className="ring-1 ring-white mt-4"
        />
        <ResponsibleSelect
          setResponsibleId={setResponsibleId}
          className="ring-1 ring-white mt-4"
        />
      </div>
      <div className="flex justify-between gap-4 bg-stone-700 px-8 py-4 shadow-2xl rounded-xl mt-4 overflow-x-auto">
        {Array.from(statusMap.entries()).map((status) => (
          <TaskColumn
            groupBy={groupBy}
            responsibleId={responsibleId}
            userId={user.data!.id}
            key={status[0]}
            status={status[0]}
            statusName={status[1]}
          />
        ))}
      </div>
    </Container>
  );
}

export default MainPage;
