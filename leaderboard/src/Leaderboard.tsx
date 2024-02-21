import { useState, useEffect } from 'react'
import io from "socket.io-client"
import './css/App.css'
import {Score} from "./types";
import Table from "./Table.tsx";
import ConfettiExplosion from 'react-confetti-explosion';

function Leaderboard() {
  const [scores, setScores] = useState([] as Score[])
  const [connected, setConnected] = useState(false)
  
  useEffect(() => {
    const socket = io("ws://localhost:3000", {});

    socket.emit("init-client");
    socket.on("scores", (score: Score[]) => {
      console.log(score)
      setScores(score)
    })
    socket.on("new-score", (score: Score) => {
      setScores((scores) => [score, ...scores])
    })
    socket.on("connect", () => {
      setConnected(true)
    })
    socket.on("disconnect", () => {
      setConnected(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [])
  return (
    <>
      <>{connected && <ConfettiExplosion />}</>
      <h1>SpringClick Leaderboard</h1>

      <main>
        {connected ? (
          <Table scores={scores} />
        ) : (
          <p>Connecting...</p>
        )}
      </main>

    </>
  )
}

export default Leaderboard
