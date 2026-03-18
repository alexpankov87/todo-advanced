import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { updateExistingTask, removeTask } from './tasksSlice';
import { Task } from '../../types';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const dispatch = useAppDispatch();

  const handleToggle = () => {
    dispatch(updateExistingTask({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
  };

  return (
    // внутри компонента TaskItem
    <div className="flex items-center justify-between border-b dark:border-gray-700 py-2">
    <div className="flex items-center space-x-3">
        <input
        type="checkbox"
        checked={task.completed}
        onChange={handleToggle}
        className="w-5 h-5 text-blue-600 dark:bg-gray-700"
        />
        <Link to={`/task/${task.id}`} className="text-lg hover:underline dark:text-white">
        {task.title}
        </Link>
    </div>
    <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
        Удалить
    </button>
    </div>
  );
};

export default TaskItem;