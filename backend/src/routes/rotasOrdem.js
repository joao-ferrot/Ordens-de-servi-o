import express from "express";
import OrdemControl from "../controller/OS_controller.js";


//criar outras rotas ainda 

const OrdemRotas=express.Router();
OrdemRotas.get('/Servicos', OrdemControl.CarregarOrdens)
OrdemRotas.post('/NovaOrdem',OrdemControl.CriarOrdem)



export default OrdemRotas