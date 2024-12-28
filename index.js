/*import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let clients = 0;
let looking_for_a_partner = [];
let look_forward = [];
let in_chat = {};

io.on("connection", (socket) => {
  clients++;
  look_forward.push(socket.id);
  io.emit("clientCount", clients);

  console.log(`Client connected: ${socket.id}`);

  // Evento para salir (mover a look_forward)
  socket.on("leave", () => {
    console.log(`Client ${socket.id} left their room.`);

    // Remover de cualquier lista activa
    looking_for_a_partner = looking_for_a_partner.filter((id) => id !== socket.id);

    if (in_chat[socket.id]) {
      const partnerId = in_chat[socket.id];
      console.log(`Notifying partner ${partnerId} about disconnection.`);

      // Notificar al compañero que se salió de la sala
      io.to(partnerId).emit("partnerLeft");

      // Removerlos de la sala y moverlos a look_forward
      delete in_chat[socket.id];
      delete in_chat[partnerId];
      look_forward.push(socket.id);
      look_forward.push(partnerId);
    } else {
      look_forward.push(socket.id);
    }

    console.log("Updated look_forward:", look_forward);
  });

  // Evento para buscar pareja y entrar a looking_for_a_partner
  socket.on("share_partner", () => {
    console.log(`Client ${socket.id} is looking for a partner.`);
    if (look_forward.includes(socket.id)) {
      look_forward = look_forward.filter((id) => id !== socket.id);
    }
    looking_for_a_partner.push(socket.id);

    // Si hay al menos 2 participantes, crear sala
    if (looking_for_a_partner.length >= 2) {
      const [user1, user2] = getTwoRandomParticipants(looking_for_a_partner);
      const roomId = generateRoomId(user1, user2);

      // Removerlos de looking_for_a_partner
      looking_for_a_partner = looking_for_a_partner.filter((id) => id !== user1 && id !== user2);

      // Asignarlos como en sala
      in_chat[user1] = user2;
      in_chat[user2] = user1;

      // Notificar a ambos clientes
      io.to(user1).emit("roomAssigned", { roomId, partnerId: user2 });
      io.to(user2).emit("roomAssigned", { roomId, partnerId: user1 });
      console.log(`Room created: ${roomId} with ${user1} and ${user2}`);
    }
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    clients--;

    // Remover de listas
    looking_for_a_partner = looking_for_a_partner.filter((id) => id !== socket.id);
    look_forward = look_forward.filter((id) => id !== socket.id);

    // Si estaba en una sala, mover al compañero a look_forward
    if (in_chat[socket.id]) {
      const partnerId = in_chat[socket.id];
      console.log(`Notifying partner ${partnerId} about disconnection.`);
      io.to(partnerId).emit("partnerLeft");
      delete in_chat[socket.id];
      delete in_chat[partnerId];
      look_forward.push(partnerId);
    }

    io.emit("clientCount", clients);
  });
});

// Función para obtener dos participantes aleatorios
function getTwoRandomParticipants(list) {
  const index1 = Math.floor(Math.random() * list.length);
  let index2;

  do {
    index2 = Math.floor(Math.random() * list.length);
  } while (index2 === index1);

  return [list[index1], list[index2]];
}

// Función para generar un ID único de sala
function generateRoomId(user1Id, user2Id) {
  return [user1Id, user2Id].sort().join("_");
}

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
*/

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();

app.use(cors());
const allowedOrigins = [
  "https://match-sv54-ha5ranq63-g-elo12s-projects.vercel.app",
  "http://localhost:3000",
  "https://match-sv54.vercel.app/",
"https://match-sv54-git-main-g-elo12s-projects.vercel.app/",
"https://match-sv54-ha5ranq63-g-elo12s-projects.vercel.app/"
];

const server = http.createServer(app);
const io = new Server(server, {  cors: {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  methods: ["GET", "POST"],
  credentials: true
} });

let clients = 0;
let looking_for_a_partner = [];
let look_forward = [];
let in_chat = {};

io.on("connection", (socket) => {
  clients++;
  look_forward.push(socket.id);
  io.emit("clientCount", clients);

  //console.log(`Client connected: ${socket.id}`);

  // Evento para salir (mover a look_forward)
  socket.on("leave", () => {
    console.log(`Client ${socket.id} left their room.`);

    looking_for_a_partner = looking_for_a_partner.filter((id) => id !== socket.id);

    if (in_chat[socket.id]) {
      const partnerId = in_chat[socket.id];
      console.log(`Notifying partner ${partnerId} about disconnection.`);

      io.to(partnerId).emit("partnerLeft");

      delete in_chat[socket.id];
      delete in_chat[partnerId];
      look_forward.push(socket.id);
      look_forward.push(partnerId);
    } else {
      look_forward.push(socket.id);
    }
  });

  // Evento para buscar pareja y entrar a looking_for_a_partner
  socket.on("share_partner", () => {
    if (look_forward.includes(socket.id)) {
      look_forward = look_forward.filter((id) => id !== socket.id);
    }
    looking_for_a_partner.push(socket.id);

    if (looking_for_a_partner.length >= 2) {
      const [user1, user2] = getTwoRandomParticipants(looking_for_a_partner);
      const roomId = generateRoomId(user1, user2);

      looking_for_a_partner = looking_for_a_partner.filter((id) => id !== user1 && id !== user2);

      in_chat[user1] = user2;
      in_chat[user2] = user1;

      io.to(user1).emit("roomAssigned", { roomId, partnerId: user2 });
      io.to(user2).emit("roomAssigned", { roomId, partnerId: user1 });
    }
  });

  // Evento para enviar mensajes al compañero
  socket.on("sendMessage", (message) => {
    const partnerId = in_chat[socket.id];
    if (partnerId) {
      io.to(partnerId).emit("receiveMessage", { message, sender: "stranger" });
      //console.log(`Message from ${socket.id} to ${partnerId}: ${message}`);
    }
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    //console.log(`Client disconnected: ${socket.id}`);
    clients--;

    looking_for_a_partner = looking_for_a_partner.filter((id) => id !== socket.id);
    look_forward = look_forward.filter((id) => id !== socket.id);

    if (in_chat[socket.id]) {
      const partnerId = in_chat[socket.id];
      //console.log(`Notifying partner ${partnerId} about disconnection.`);
      io.to(partnerId).emit("partnerLeft");
      delete in_chat[socket.id];
      delete in_chat[partnerId];
      look_forward.push(partnerId);
    }

    io.emit("clientCount", clients);
  });
});

function getTwoRandomParticipants(list) {
  const index1 = Math.floor(Math.random() * list.length);
  let index2;

  do {
    index2 = Math.floor(Math.random() * list.length);
  } while (index2 === index1);

  return [list[index1], list[index2]];
}

function generateRoomId(user1Id, user2Id) {
  return [user1Id, user2Id].sort().join("_");
}

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
