import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../../types';

interface TasksListProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void; // новый пропс
}

const TasksList: React.FC<TasksListProps> = ({ tasks, onTaskClick }) => {
  if (tasks.length === 0) {
    return <div className="text-gray-500">Нет задач</div>;
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} onTaskClick={onTaskClick} />
      ))}
    </div>
  );
};

export default TasksList;