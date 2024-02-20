import { Server } from "socket.io"
import Database from 'better-sqlite3';

const db = new Database('./db.sqlite3', { verbose: console.log });

db.exec('CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, cps INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)');

const addScore = db.prepare('INSERT INTO scores (username, cps) VALUES (@username, @cps)');
const getScores = db.prepare('SELECT * FROM scores ORDER BY cps DESC');

const io = new Server(3000)

io.on("connection", (socket) => {
  console.log(`[INFO] - User connected: ${socket.id}`)

  socket.on("send-score", (score: any) => {
    console.log(`[INFO] - User ${score.username} sent a score of ${score.cps}`)
    io.emit("new-score", score)
  })

  socket.on("init", () => {
    console.log(`[INFO] - User ${socket.id} initialized`)
    const scores = getScores.all()
    console.log(`[INFO] - Sending scores to user ${socket.id}`)
    console.log(scores)
    socket.emit("scores", scores)
  })
})

console.log("[INFO] - Server is running on port 3000")

