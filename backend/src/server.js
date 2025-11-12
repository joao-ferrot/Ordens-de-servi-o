import express from "express";
import conecta_db from "./config/connect.js";
import cors from "cors";


const serve=express();

serve.use(cors());

await conecta_db();

const porta=process.env.PORTA;

const end=process.env.END

serve.listen(porta,()=>console.log(`servidor:${end}:${porta}`));

