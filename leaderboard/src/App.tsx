import { useState, useEffect } from 'react'
import io from "socket.io-client"
import './App.css'

type Score = {
  id: number;
  username: string;
  cps: number;
  created_at: string;
}

const socket = io("ws://localhost:3000", {});

function App() {
  const [scores, setScores] = useState([] as Score[])
  
  useEffect(() => {
    socket.emit("init");
    socket.on("scores", (score: Score[]) => {
      setScores(score)
    })
  })
  return (
    <>
      <h1>SpringClick Leaderboard</h1>
      <main>
        {scores.map((score) => 
        <div>
          {score.username} : {score.cps}
        </div>
        )}
      </main>
    </>
  )
}

export default App
