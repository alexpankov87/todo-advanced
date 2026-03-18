import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../../types';

interface TasksListProps {
  tasks: Task[];
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return <div className="text-gray-500">Нет задач</div>;
  }

  return (
    <div className="space-y-2">
      {tasks.map(task => <TaskItem key={task.id} task={task} />)}
    </div>
  );
};

export default TasksList;