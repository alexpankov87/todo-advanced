# 📋 Todo Advanced

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-purple?logo=redux)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

**Todo Advanced** — это полнофункциональное приложение для управления задачами с широкими возможностями: категории, подзадачи, фильтры, поиск, тёмная тема и многое другое. Проект демонстрирует современный подход к разработке на React с использованием лучших практик и библиотек.

🔗 **Живое демо:** [todo-advanced.vercel.app](https://todo-advanced.vercel.app)

---

## ✨ Возможности

- ✅ Создание, редактирование и удаление задач
- 📂 Управление категориями (CRUD) с выбором цвета
- 🔍 Поиск по заголовку и описанию
- 🏷️ Фильтрация задач по статусу (все / активные / завершённые) и категориям
- ⬇️ Сортировка по дате (новые / старые)
- 📝 Добавление, переключение и удаление подзадач
- 🌙 Тёмная тема (с сохранением в localStorage)
- 📱 Адаптивный интерфейс (Tailwind CSS)
- 🔔 Уведомления о действиях (react-hot-toast)
- ⏳ Индикаторы загрузки при операциях с API
- 🧪 Unit-тесты (Jest + React Testing Library)

---

## 🛠️ Технологический стек

- **React** 19 (Create React App)
- **TypeScript**
- **Redux Toolkit** (управление состоянием)
- **React Router** v7 (маршрутизация)
- **Tailwind CSS** (стилизация)
- **Axios** (запросы к API)
- **MockAPI.io** (бэкенд-заглушка)
- **React Hot Toast** (уведомления)
- **React Icons** (иконки — заменены на эмодзи из-за временных проблем, но можно вернуть)
- **Jest** + **React Testing Library** (тесты)

---

## 🚀 Локальный запуск

 1. Клонируйте репозиторий
git clone https://github.com/alexpankov87/todo-advanced.git
cd todo-advanced

2. Установите зависимости
npm install
3. Настройте переменные окружения
Создайте файл .env в корне проекта и укажите URL вашего mockAPI (или любого другого API):
REACT_APP_API_URL=https://ваш-id.mockapi.io/tasks
Вы можете использовать бесплатный сервис mockapi.io для создания тестового бэкенда.

4. Запустите проект в режиме разработки
npm start
Приложение откроется по адресу http://localhost:3000.

5. Сборка для продакшена
npm run build

🧪 Запуск тестов
Проект покрыт юнит-тестами для Redux-слайсов и основных компонентов.

npm test
Для просмотра покрытия:

npm test -- --coverage
🌍 Деплой на Vercel
Проект задеплоен на Vercel. Для собственного деплоя:

Залейте код на GitHub.

Зарегистрируйтесь на vercel.com.

Импортируйте репозиторий.

Добавьте переменную окружения REACT_APP_API_URL в настройках проекта.

Нажмите Deploy — готово!

