import "reflect-metadata";
import socketServer from "./socket";

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = socketServer(server);

// io.on("connection", (socket: any) => {
//   console.log(`User connected: ${socket.id}`);
// });

server.listen(3001, () => {
  console.log("====================================");
  console.log("SERVER IS RUNNING");
  console.log("====================================");
});
