import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Session } from "@/@types/prisma.ts";
import { useQuery } from "react-query";
import { fetchSubordinates } from "@/lib/fetchSubordinates.ts";
import { getUserSession } from "@/lib/getUserSession";
import { Skeleton } from "@/components/ui/skeleton.tsx";

interface Props {
  setResponsibleId: (responsibleId: number) => void;
  className?: string;
}
export const ResponsibleSelect: React.FC<Props> = ({
  className,
  setResponsibleId,
}) => {
  const user = useQuery("user", getUserSession);
  if (!user.data || !user.data.id) {
    return <Skeleton className="w-full h-[40px]" />;
  }

  const { data } = useQuery(
    "subordinates",
    async () => fetchSubordinates(user.data!.id),
    {
      keepPreviousData: true,
    },
  );

  if (!data) {
    return <Skeleton className="w-full h-[40px]" />;
  }
  return (
    <Select onValueChange={(e) => setResponsibleId(+e)}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="Ответственный: " />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0">Все</SelectItem>
        <SelectItem value={String(user.data.id)}>Мои задачи</SelectItem>
        {data.subordinates.map((subordinate: Session) => (
          <SelectItem key={subordinate.id} value={String(subordinate.id)}>
            {subordinate.name} {subordinate.surname}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
