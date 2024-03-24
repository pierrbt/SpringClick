import { createServer } from "node:http";
import { join } from "node:path";
// @ts-ignore
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { initClient, newScore, removeScore } from "./handlers";

const app = express();
const server = createServer(app);

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(
	"/leaderboard",
	express.static(join(__dirname, "../../leaderboard/dist")),
);

// Création du serveur socket.io
const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	// Lorsqu'un utilisateur se connecte
	console.log(`[INFO] - User connected: ${socket.id}`); // On affiche son id

	// On écoute les événements "add-score", "init-client" et "remove-score"
	socket.on("add-score", newScore);
	socket.on("init-client", initClient(socket));
	socket.on("remove-score", removeScore);
});

server.listen(3000, () => {
	console.log("[INFO] - 🚀 Server is running on http://localhost:3000");
});

export default io;
