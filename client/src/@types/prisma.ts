export type Status = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export interface User {
  id: number;
  login: string;
  password: string;
  name: string;
  surname: string;
  patronym?: string;
  supervisorId?: number;
  supervisor?: User;
  subordinates?: User[];
  createdTasks?: ITask[];
  responsibleTasks?: ITask[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ITask {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  creator?: User;
  creatorId: number;
  responsible?: User;
  responsibleId?: number;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type Session = {
  id: number;
  login: string;
  name: string;
  surname: string;
  patronym?: string;
};
