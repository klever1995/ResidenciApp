const io = require("socket.io-client");
const socket = io("http://localhost:4001"); 

socket.on("connect", () => {
    console.log("✅ Cliente conectado a WebSockets");
    socket.emit("new_reservation", { id: 1, student_id: 2, property_id: 3, status: "pending" });
});

socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado");
});
