// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Мок для API URL, чтобы тесты не падали
process.env.REACT_APP_API_URL = 'https://mockapi.example.com/tasks';

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Мок для window.matchMedia (необходим для ThemeProvider)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,                         // явно задаём булево значение
    media: query,
    onchange: null,
    addListener: jest.fn(),                 // для старых API
    removeListener: jest.fn(),               // для старых API
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})
