import { addScore, deleteScore, getScore, getUserScore } from "./db";
import io from "./index";
import type { Score } from "./types";

// Fonctions des sockets
const newScore = ({ username, cps }: { username: string; cps: number }) => {
	// Fonction appelée lorsqu'un utilisateur envoie un score
	console.log(`[INFO] - User ${username} sent a score of ${cps}`);
	const u_scores = getUserScore.all(username) as Score[];

	if (u_scores.length !== 0 && u_scores[0].cps < cps) {
		for (const { id } of u_scores) {
			deleteScore.run(id);
		}

		addScore.run({ username, cps }); // On ajoute le score à la base de données
		const scores = getScore.all();
		io.emit("scores", scores); // On envoie les scores à tous les clients
	} else if (u_scores.length === 0) {
		addScore.run({ username, cps }); // On ajoute le score à la base de données
		const scores = getScore.all();
		io.emit("scores", scores); // On envoie les scores à tous les clients
	} else {
		return;
	}
};

const initClient = (socket: {
	id: string;
	emit: (type: string, data: unknown) => void;
}) => {
	// Fonction appelée lorsqu'un utilisateur se connecte
	return () => {
		console.log(`[INFO] - User ${socket.id} initialized`);
		const scores = getScore.all();
		socket.emit("scores", scores);
	};
};

const removeScore = (id: number) => {
	// Fonction appelée lorsque le leaderboard supprime un score
	deleteScore.run(id); // On supprime le score de la base de données
	const scores = getScore.all();
	io.emit("scores", scores);
};

export { newScore, initClient, removeScore };
