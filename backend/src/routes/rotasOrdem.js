import OrdemControl from "../controller/OS_controller.js";
import express from "express";

//criar outras rotas ainda 

const OrdemRotas=express.Router();
OrdemRotas.get('/Serviços', OrdemControl.CarregarOrdens)
OrdemRotas.post('/NovaOrdem',OrdemControl.CriarOrdem)

