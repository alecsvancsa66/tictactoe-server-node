import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

import { MainController } from "./controllers/mainController";

export default (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", //https://localhost:3000
      methods: ["GET", "POST", "PATCH", "OPTIONS"],
    },
  });

  useSocketServer(io, { controllers: [MainController] });

  return io;
};
