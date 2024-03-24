import {io} from "socket.io-client"

const socket = io("ws://localhost:3000", {});

let counter = 50;
const names = ["Pierre", "Leopold", "Joshua", "Basile", "Tom", "Elie", "Eliott", "Ethan", "Nathan", "Noah", "Gabriel", "Louis", "Raphael", "Jules", "Adam", "Leo", "Arthur", "Hugo", "Maël", "Lucas", "Liam", "Léo", "Evan", "Gabin", "Sacha", "Aaron", "Mathis", "Théo", "Enzo", "Antoine", "Maxime", "Paul", "Alexandre", "Nolan", "Valentin", "Timéo", "Tom", "Matteo", "Maxence", "Baptiste", "Rayan", "Clément", "Yanis", "Marius", "Victor", "Elias", "Isaac", "Mathéo", "Augustin", "Eliot", "Léon", "Esteban", "Nino", "Léandre"]

 // setInterval(() => {
 //     counter++;
 //     socket.emit("add-score", {username: names[counter % names.length], cps: (Math.random() * 20).toFixed(2)})
 // }, 1000)

socket.emit("add-score", {username: "Boss", cps: 21.1})

socket.on("scores", (scores) => {
    console.log(scores)
})