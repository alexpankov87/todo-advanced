import React from 'react';
import { Category } from '../../types';

interface CategoryBadgeProps {
  category?: Category | null;
  onClick?: () => void;
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, onClick }) => {
  if (!category) {
    return (
      <button
        onClick={onClick}
        className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 transition-colors"
      >
        Без категории
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="text-xs px-2 py-1 rounded text-white hover:opacity-80 transition-opacity"
      style={{ backgroundColor: category.color }}
    >
      {category.name}
    </button>
  );
};

export default CategoryBadge;