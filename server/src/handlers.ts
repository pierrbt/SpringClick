import {addScore, getScore, getLastScore, deleteScore} from "./db";
import io from "./index";

// Fonctions des sockets
const newScore = ({username, cps}: {username: string, cps:number}) => { // Fonction appelée lorsqu'un utilisateur envoie un score
  console.log(`[INFO] - User ${username} sent a score of ${cps}`)
  const exec = addScore.run({username, cps}) // On ajoute le score à la base de données
  console.log(exec.lastInsertRowid);
  const score = getLastScore.get(exec.lastInsertRowid) // On récupère le score ajouté
  io.emit("new-score", score) // On envoie le score à tous les clients
}

const initClient = (socket: {id: string, emit: (type: string, data: unknown) => void}) => { // Fonction appelée lorsqu'un utilisateur se connecte
  return  () => {
    console.log(`[INFO] - User ${socket.id} initialized`)
    const scores = getScore.all()
    socket.emit("scores", scores)
  }
}

const removeScore = (id: number) => {
  deleteScore.run(id) // On supprime le score de la base de données
}

export {newScore, initClient, removeScore}