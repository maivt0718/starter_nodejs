import express from "express";
import pool from "./db.js";
import { status } from "./const.js";
import rootRoutes from "./src/routes/root.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { createServer } from "http";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

// Create the express object with the main server for API call and for SocketIO
export const app = express();

// create http server
const server = createServer(app);
// create soket server
// io is object of socketIO
// socket is object of socketIO from client
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000",
  },
});
// listen the connection's event from client through socketIO
// on receives events, emit sends event with 2 params: event type (socketIO, event from users), function
let number = 0;
io.on("connection", (socket) => {
  socket.on("send-emit", () => {
    console.log(`FE send increase`);
    number = number+1;
    // server bắn event cho tất cả client
    io.emit("send-new-number", number);
  });
  socket.on("send-reduce", () => {
    console.log(`FE send reduce`);
    number = number-1;
    // server bắn event cho tất cả client
    io.emit("send-new-number", number);
  });
  socket.on('send-mess', async ({user_id, content}) => {
    let newChat = {
        user_id,
        content,
        date: new Date()
    };
    await prisma.chat.create({data: newChat})
    io.emit("sv-send-mess", {user_id, content});
  })
});

// BE receives events from client

// Create moddleware to read json data
app.use(express.json());
app.use(express.static("."));

// Create middleware allowing FE to call API to BE
app.use(
  cors({
    origin: "http://localhost:4000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(rootRoutes);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/test_api", (req, res) => {
  res.send("test api");
});

// Get params from URL
// app.post("/users/:id/:hoten", (req, res) => {
//     let params = req.params
//     let {id, hoten} = params
//     let body = req.body

//     res.send({id, hoten})
// })

// Get query from URL
app.get("/test_query", (req, res) => {
  let query = req.query;
  res.send(query);
});

// Get header from request
app.get("/test_header", (req, res) => {
  let headers = req.headers;
  res.send(headers);
});

// app.get("/users", async (req, res) => {
//     try {
//         const [data] = await pool.query(`SELECT *FROM users limit 1`)
//         res.status(status.OK).json(data)
//     } catch (error) {
//         res.status(status.INTERNAL_SERVER).json({message: `${error}`})
//     }
// })

server.listen(3000, () => {
  console.log("Server is running ");
});
