import express from "express";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import cors from 'cors';

const port = 3000;

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(
    cors({
        origin: "http://localhost:5173/",
        methods: ["GET", "POST"],
        credentials: true,
    }))

app.get("/", (req, res) => {
    res.send("Hello World");
})

io.on("connection", (Socket) => {
    console.log("User Connected", Socket.id);

    Socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        io.to(room).emit("receive-message", message);
    });

    Socket.on("join-room", (room) => {
        Socket.join(room);
        console.log(`User joined room ${room}`);
    })


    Socket.on("disconnect", () => {
        console.log("User Disconnected", Socket.id);
    });

});

server.listen(port, () => {

    console.log(`Server is running on port  ${port}`);
})