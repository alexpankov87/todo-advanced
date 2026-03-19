import React from 'react';

export const BrowserRouter = ({ children }: any) => <div>{children}</div>;
export const Link = ({ children, to }: any) => <a href={to}>{children}</a>;
export const useNavigate = () => jest.fn();
export const useParams = () => ({});
