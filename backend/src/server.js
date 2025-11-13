import 'dotenv/config';
import express from "express";
import conecta_db from "./config/connect.js";
import cors from "cors";
import routes from "./routes/rotaP.js";




const server=express();

server.use(cors());
routes(server);

await conecta_db();
const porta=process.env.PORTA;
const end=process.env.END

server.listen(porta,()=>console.log(`servidor:${end}:${porta}`));

