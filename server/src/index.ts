import { Server } from "socket.io"
import {initClient, newScore, removeScore} from "./handlers";

const io = new Server(3000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connection", (socket) => {
  console.log(`[INFO] - User connected: ${socket.id}`)

  socket.on("send-score", newScore)
  socket.on("init", initClient(socket))
  socket.on("remove", removeScore)
})

console.log("[INFO] - 🚀 Server is running on port 3000")
export default io;
