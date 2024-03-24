import { useEffect, useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import io, { type Socket } from "socket.io-client";
import "./css/Leaderboard.css";
import type { Score } from "./types";

function isEqual(a: Score, b: Score) {
  return a.id === b.id;
}

function Leaderboard() {
	const [scores, setScores] = useState([]);
	const [connected, setConnected] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [confetti, setConfetti] = useState(false);
  const [previousLeader, setPreviousLeader] = useState(null);
	const socketRef = useRef(null as Socket | null);

	useEffect(() => {
		const socket = io("ws://localhost:3000");
		socketRef.current = socket;

		socket.emit("init-client");

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

  useEffect(() => {
    socketRef.current!.on("scores", (score) => {
      if (
        scores.length === 0 ||
        (score.length > 0 && !isEqual(score[0], scores[0]))
      ) {
        if (previousLeader !== null && !isEqual(score[0], previousLeader)) {
          setConfetti(true);
        }
        setPreviousLeader(score[0]);
      }
      setScores(score);
    });
  }, [socketRef.current, scores, previousLeader]);

	const toggleEditMode = () => {
		setEditMode(!editMode);
	};

	return (
		<>
			{confetti && (
				<ConfettiExplosion
					onComplete={() => {
						setConfetti(false);
					}}
					force={0.8}
					duration={3000}
					particleCount={250}
					width={1600}
				/>
			)}
			<main>
				<div id="header">
					<h1>Classement SpringClick</h1>
				</div>
				{connected ? (
					<div id="leaderboard">
						<div className="ribbon" />
						<table>
              <tbody>
                {scores.map((score: Score, index: number) => (
                  <tr key={score.id} onMouseUp={toggleEditMode}>
                    <td className="number">{index + 1}</td>
                    <td className="name">{score.username}</td>
                    <td className="points"><span style={{color: "grey"}}>CPS</span>&nbsp;&nbsp;{score.cps.toFixed(2)}</td>
                    {editMode && (
                      <td>
                        <button
                          type="button"
                          onMouseUp={() => {
                            socketRef.current?.emit("remove-score", score.id);
                          }}
                        >
                          <svg
                            role="img"
                            aria-label="Delete"
                            xmlns="http://www.w3.org/2000/svg"
                            height="24"
                            viewBox="0 -960 960 960"
                            width="24"
                          >
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {scores.length === 0 && (
                  <tr>
                    <td className="name">
                      Soyez le premier à tenter votre chance !
                    </td>
                  </tr>
                )}
              </tbody>
						</table>
					</div>
				) : (
					<p>Connecting...</p>
				)}
			</main>
			<footer>
				<p>Par Pierre Bidet - Lycée Eugène Livet - 2024</p>
			</footer>
		</>
	);
}

export default Leaderboard;
