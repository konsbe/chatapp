import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

const PORT = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

const socketIO = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//Add this before the app.get() block
let users: any = [];
let usersCall: any = [];

socketIO.on("connection", (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("message", (data: any) => {
    // console.log(data);
    socketIO.emit("messageResponse", data);
  });

  socket.on("typing", (data: any) => {
    socket.broadcast.emit("typingResponse", data);
  });

  //Listens when a new user joins the server
  socket.on("newUser", (data: any) => {
    //Adds the new user to the list of users
    users.push(data);
    console.log(data);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
  });

  socket.on("disconnect", () => {
    console.log("🔥: A user disconnected");
    //Updates the list of users when a user disconnects from the server
    users = users.filter((user: any) => user.socketID !== socket.id);
    // console.log(users);
    //Sends the list of users to the client
    socketIO.emit("newUserResponse", users);
    socket.disconnect();
  });
});

socketIO.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("closeConnection", () => {
    console.log("🔥: Call Ended");
    socket.broadcast.emit("callEnded");
    // socketIO.emit("newUserResponse", users);
  });

  socket.on("callUser", (data) => {
    console.log("🔥: A user is calling", data);
    socketIO.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    console.log("🔥: A user is ansowering", data);
    usersCall.push(data);
    socketIO.to(data.to).emit("callAccepted", data.signal);
  });
});

app.get("/api", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
