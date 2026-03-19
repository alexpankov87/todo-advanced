import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { updateExistingTask, removeTask } from './tasksSlice';
import { Task, SubTask } from '../../types';
import Modal from '../../components/Modal';
import AddEditTaskModal from './AddEditTaskModal';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ task, onClose }) => {
  const dispatch = useAppDispatch();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleToggleComplete = () => {
    dispatch(updateExistingTask({ ...task, completed: !task.completed }));
  };

  const handleDelete = () => {
    dispatch(removeTask(task.id));
    onClose(); // закрываем модалку после удаления
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title: newSubtaskTitle,
      completed: false,
    };
    const updatedTask: Task = {
      ...task,
      subtasks: [...task.subtasks, newSubtask],
    };
    dispatch(updateExistingTask(updatedTask));
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map(sub =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    dispatch(updateExistingTask({ ...task, subtasks: updatedSubtasks }));
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(sub => sub.id !== subtaskId);
    dispatch(updateExistingTask({ ...task, subtasks: updatedSubtasks }));
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={task.title}>
      <div className="space-y-4">
         {/* Шапка с заголовком и кнопкой редактирования */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">{task.title}</h2>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            ✏️
          </button>
        </div>
        {/* Статус выполнения */}
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleToggleComplete}
            className="w-5 h-5"
          />
          <span>Завершена</span>
        </label>

        {/* Описание */}
        {task.description && (
          <div>
            <h3 className="font-semibold mb-1">Описание</h3>
            <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
          </div>
        )}

        {/* Подзадачи */}
        <div>
          <h3 className="font-semibold mb-2">Подзадачи</h3>
          <div className="space-y-2">
            {task.subtasks.map(sub => (
              <div key={sub.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => handleToggleSubtask(sub.id)}
                  />
                  <span className={sub.completed ? 'line-through text-gray-400' : ''}>
                    {sub.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteSubtask(sub.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 flex">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Новая подзадача"
              className="border rounded-l px-3 py-2 flex-1 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={handleAddSubtask}
              className="bg-green-500 text-white px-4 py-2 rounded-r hover:bg-green-600"
            >
              Добавить
            </button>
          </div>
        </div>

        {/* Кнопка удаления задачи */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Удалить задачу
          </button>
        </div>
      </div>
      {isEditModalOpen && (
        <AddEditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          taskToEdit={task}
        />
      )}
    </Modal>
  );
};

export default TaskDetailsModal;