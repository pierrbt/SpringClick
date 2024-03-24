import { existsSync } from "fs";
import { createServer } from "node:http";
import { join } from "node:path";
// @ts-ignore
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { initClient, newScore, removeScore } from "./handlers";

console.log("[INFO] - Starting server...");

let leaderboardPath = join(__dirname, "../../leaderboard/dist");

if (!existsSync(leaderboardPath)) {
	const secondaryPath = join(__dirname, "../leaderboard");
	if (existsSync(secondaryPath)) {
		leaderboardPath = secondaryPath;
	} else {
		console.error(
			"[ERROR] - Leaderboard folder not found, please build it in '/leaderboard/dist' or '/server/leaderboard'",
		);
		process.exit(1);
	}
}

const app = express();
const server = createServer(app);

app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use("/leaderboard", express.static(leaderboardPath));

app.get("/", (_, res) => {
	res.sendFile(join(__dirname, "../public/root.html"));
});

app.use((_, res) => {
	res.sendFile(join(__dirname, "../public/404.html"));
});

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

app.on("error", (err: any) => {
	console.error(`[ERROR] - ${err}`);
});

server.on("error", (err) => {
	console.error(`[ERROR] - ${err}`);
});

server.listen(3000, () => {
	console.log(
		"[WELCOME] - 🚀 Server is running on http://localhost:3000 , Socket.IO is also running on ws://localhost:3000",
	);
});

export default io;
