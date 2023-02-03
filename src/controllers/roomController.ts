import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class RoomController {
  private getSocketGameRoom(socket: Socket): string {
    // remove the default socket room
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

  @OnMessage("join_game")
  public async joinGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    console.log("New User join game", message, socket.id);

    const connectedSockets = io.sockets.adapter.rooms.get(message.roomId);

    // remove the default socket room
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room: any) => room !== socket.id
    );

    // if socket is already connected to a room or in the room there are already two sockets
    if (socketRooms.length > 0 || connectedSockets?.size === 2) {
      console.log(socketRooms, connectedSockets);

      socket.emit("room_join_error", {
        error: "Room is full please choose another room!",
      });
    } else {
      await socket.join(message.roomId);
      socket.emit("room_joined");

      // after the user joins - check if the game can start
      if (io.sockets.adapter.rooms.get(message.roomId)?.size === 2) {
        socket.emit("start_game", { start: true, symbol: "x" });
        socket
          .to(message.roomId)
          .emit("start_game", { start: false, symbol: "o" });
      }
    }
  }

  @OnMessage("leave_game")
  public async leaveGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    // remove the default socket room
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room: any) => room !== socket.id
    );

    const gameRoom = this.getSocketGameRoom(socket);
    if (socketRooms.length > 0) {
      await socket.leave(gameRoom);
      socket.to(gameRoom).emit("on_leave_game");
    }
  }
}
