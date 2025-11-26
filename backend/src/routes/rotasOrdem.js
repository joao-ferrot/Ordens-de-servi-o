import express from "express";
import OrdemControl from "../controller/OS_controller.js";

const OrdemRotas = express.Router();

// ROTAS DE ORDENS DE SERVIÇO (OS)
OrdemRotas.get('/ordens', OrdemControl.CarregarOrdens);      // Listar todas
OrdemRotas.get('/ordens/:id', OrdemControl.buscarOrdem);     // Buscar uma
OrdemRotas.post('/ordens', OrdemControl.CriarOrdem);         // Criar (Antigo /NewOs)
OrdemRotas.put('/ordens/:id', OrdemControl.AtualizacaoOrdem);// Atualizar
OrdemRotas.delete('/ordens/:id', OrdemControl.deletarOrdem); // Deletar

// ROTAS DE EQUIPAMENTOS (CAIXAS)
OrdemRotas.get('/equipamentos', OrdemControl.CarregarCaixa); // Listar todas
OrdemRotas.post('/equipamentos', OrdemControl.CriarCaixa);   // Criar (Antigo /NewCard)

export default OrdemRotas;