import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected");

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User joined room: ${roomId}`);
        });

        socket.on("privateMessage", async ({ content, senderId, receiverId, friendshipId }) => {
            const message = { content, senderId, receiverId, friendshipId };
            socket.to(friendshipId).emit("privateMessage", message);
        });

        socket.on("friendRequest", (receiverId) => {
            console.log(receiverId);
            socket.to(receiverId).emit("friendRequest", "You have a new friend request");
        })

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});
