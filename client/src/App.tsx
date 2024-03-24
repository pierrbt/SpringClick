import { useEffect, useRef, useState } from "react";
import { type Socket, io } from "socket.io-client";
import "./App.css";

function App() {
	const [username, setUsername] = useState("");
	const [scores, setScores] = useState([]);
	const [connected, setConnected] = useState(false);

	// const [gameStarted, setGameStarted] = useState(false);

	const buttonRef = useRef(null! as HTMLButtonElement);
	const socketRef = useRef(null! as Socket);

	useEffect(() => {
		const socket = io("ws://localhost:3000");
		socketRef.current = socket;

		socket.emit("init-client");

		socket.on("scores", (score) => {
			console.log(score);
			setScores(score);
		});

		socket.on("connect", () => {
			setConnected(true);
		});

		socket.on("disconnect", () => {
			setConnected(false);
		});

		return () => {
			socket.disconnect();
		};
	}, []);
	return (
		<>
			<header>
				<nav>
					<h1>SpringClick</h1>
				</nav>
			</header>
			<main>
				{!connected ? (
					<h1>Connexion en cours...</h1>
				) : (
					<>
						<aside>
							<h1>Classement</h1>
							<ol>
								{scores.map((score: any) => (
									<li>
										{score.username} : {score.cps.toFixed(1)}
									</li>
								))}
							</ol>

							{/*  classement latéral  */}
						</aside>
						<section>
							{/*  page principale  */}
							{username === "" ? (
								<div>
									<h2>Entrez votre nom :</h2>
									<input
										type="text"
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												setUsername(e.currentTarget.value);
											}
										}}
									/>
									<label>Appuyez sur &lt;Entrée&gt; pour valider</label>
								</div>
							) : (
								<div>
									<h2>C'est l'heure de briller, {username}</h2>
									<button ref={buttonRef}>GO</button>
								</div>
							)}
						</section>
					</>
				)}
			</main>
		</>
	);
}

export default App;
