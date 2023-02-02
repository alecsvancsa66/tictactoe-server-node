import { useSocketServer } from "socket-controllers";
import { Server } from "socket.io";

import { MainController } from "./controllers/mainController";
import { RoomController } from "./controllers/roomController";
import { GameController } from "./controllers/gameControllet";

export default (httpServer: any) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", //https://localhost:3000
      methods: ["GET", "POST", "PATCH", "OPTIONS"],
    },
  });

  useSocketServer(io, {
    controllers: [MainController, RoomController, GameController],
  });

  return io;
};
