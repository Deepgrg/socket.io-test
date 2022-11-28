//socket.io
//for realtime communication
//upgrades from http to web socket
//goes to long pooling if ws connection is not possible
//used for chat/notification etc
const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const server = http.createServer(app);
const SocketServer = new Server(server, { cors: { origin: "*" } });
const sender = async (socket) => {
  socket.emit("reply-server", `This is reply from server`);
  socket.emit("test-event", `this is test event`);
};
let users = [];
SocketServer.on("connection", (socket) => {
  // console.log(socket);
  console.log(`A user is Connected `);
  users.push(socket.id);
  socket.on("new-message", (messages) => {
    const { message } = JSON.parse(messages);
    console.log(`The mesage from socket io ${message}`);
    sender(socket);
  });
  socket.on("fcli", (message) => {
    console.log("personal message");
    sendPersonal(socket, users[users.length - 1]);
  });
  socket.on("disconnecting", () => {
    console.log(`a user is disconnected`);
  });
  sendPersonal(users[users.length - 1]);
});
//
const sendPersonal = async (who) => {
  SocketServer.to(who).emit("pm", `this is a personal message ${new Date()}`);
};
app.get("/hello", (req, res) => {
  return res
    .status(200)
    .send({ message: "Hey i am using a sokcet io web socket" });
});
server.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});
