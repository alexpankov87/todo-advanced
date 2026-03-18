export type Category = {
  id: string;
  name: string;
  color: string;
};

export type SubTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  categoryId?: string | null;
  subtasks: SubTask[];
  createdAt: number;
};