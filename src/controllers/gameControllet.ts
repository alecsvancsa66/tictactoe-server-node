import {
  ConnectedSocket,
  MessageBody,
  OnMessage,
  SocketController,
  SocketIO,
} from "socket-controllers";
import { Server, Socket } from "socket.io";

@SocketController()
export class GameController {
  private getSocketGameRoom(socket: Socket): string {
    // remove the default socket room
    const socketRooms = Array.from(socket.rooms.values()).filter(
      (room) => room !== socket.id
    );
    const gameRoom = socketRooms && socketRooms[0];

    return gameRoom;
  }

  @OnMessage("update_game")
  public async updateGame(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_update", message);
  }

  @OnMessage("game_won")
  public async gameWon(
    @SocketIO() io: Server,
    @ConnectedSocket() socket: Socket,
    @MessageBody() message: any
  ) {
    const gameRoom = this.getSocketGameRoom(socket);
    socket.to(gameRoom).emit("on_game_won", message);
  }
}
