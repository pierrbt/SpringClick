import {addScore, getScore, getLastScore, deleteScore} from "./db";
import io from "./index";

const newScore = ({username, cps}: {username: string, cps:number}) => {
  console.log(`[INFO] - User ${username} sent a score of ${cps}`)
  const exec = addScore.run({username, cps})
  console.log(exec.lastInsertRowid);
  const score = getLastScore.get(exec.lastInsertRowid)
  console.log(score)
  io.emit("new-score", score)
}

const initClient = (socket) => {
  return  () => {
    console.log(`[INFO] - User ${socket.id} initialized`)
    const scores = getScore.all()
    socket.emit("scores", scores)
  }
}

const removeScore = (id: number) => {
  deleteScore.run(id)
}

export {newScore, initClient, removeScore}