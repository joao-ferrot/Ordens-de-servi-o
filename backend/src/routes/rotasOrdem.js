import express from "express";
import OrdemControl from "../controller/OS_controller.js";


//criar outras rotas ainda 

const OrdemRotas=express.Router();
OrdemRotas.get('/Servicos', OrdemControl.CarregarOrdens)
OrdemRotas.post('/NewOs',OrdemControl.CriarOrdem)
OrdemRotas.put('/UPservico/:id',OrdemControl.AtualizacaoOrdem);
OrdemRotas.delete('/delOs/:id', OrdemControl.deletarOrdem);
OrdemRotas.get('/Servicos/:id',OrdemControl.buscarOrdem);
OrdemRotas.get('/Servicos', OrdemControl.CarregarCaixa);
OrdemRotas.post('/NewCard',OrdemControl.CriarCaixa);


export default OrdemRotas