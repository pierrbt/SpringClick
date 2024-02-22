import {io} from "socket.io-client"

const socket = io("ws://localhost:3000", {});

socket.emit("add-score", {username: "test", cps:11})

socket.on("scores", (scores) => {
    console.log(scores)
})