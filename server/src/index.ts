import { Server } from "socket.io";
import { initClient, newScore, removeScore } from "./handlers";

// Création du serveur socket.io
const io = new Server(3000, {
	connectTimeout: 10000,
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
	socket.on("remove-score", removeScore);
	socket.on("init-client", initClient(socket));
});

console.log("[INFO] - 🚀 Server is running on port 3000");
export default io;
