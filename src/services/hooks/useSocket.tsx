import React, { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3333'
    : 'https://playground-api-zaycon.1g0r.tech';

const socket = io(baseUrl);
const SocketContext = createContext<Socket>(socket);

socket.on('connect', () => console.log('connected'));

const SocketProvider = ({ children }: any) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
export { SocketContext, SocketProvider };
