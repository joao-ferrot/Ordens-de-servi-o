import OrdemServico from "../models/modelOS.js";
import caixas from "../models/modelCartao.js";

class OrdemControl {

    // --- ORDENS ---

    static async CarregarOrdens(req, res) {
        try {
            const ordem = await OrdemServico.find();
            res.status(200).json(ordem);
        } catch (error) {
            res.status(500).json({ mensagem: "erro ao carregar a lista" });
        }
    }

    static async CriarOrdem(req, res) {
        try {
            const novaOrdem = req.body;
            // Cria no MongoDB
            const ordem = await OrdemServico.create(novaOrdem);
            res.status(200).json({ mensagem: "ordem criada", dados: ordem });
        } catch (error) {
            res.status(500).send({ mensagem: `nao foi possivel criar a ordem: ${error}` });
        }
    }

    static async buscarOrdem(req, res) {
        try {
            const id = req.params.id;
            const ordem = await OrdemServico.findById(id);
            if (!ordem) { return res.status(404).json({ erro: "id da ordem nao encontrado" }) }
            return res.status(200).json(ordem);
        } catch (error) {
            res.status(500).json(`falha ao buscar Ordem: ${error}`);
        }
    }

    static async AtualizacaoOrdem(req, res) {
        try {
            const id = req.params.id;
            // Atualiza e retorna o objeto novo (new: true)
            const resposta = await OrdemServico.findByIdAndUpdate(id, { $set: req.body }, { new: true });
            return res.status(200).json({ mensagem: "Atualização feita!", dados: resposta });
        } catch (error) {
            res.status(500).send("nao foi possivel realizar a atualizaçao");
        }
    }

    static async deletarOrdem(req, res) {
        try {
            await OrdemServico.findByIdAndDelete(req.params.id);
            res.status(200).json({ mensagem: "ordem deletada com sucesso" });
        } catch (error) {
            res.status(500).send({ mensagem: `erro ao deletar: ${error}` });
        }
    }

    // --- MAQUINARIO (CAIXAS) ---

   static async CriarCaixa(req, res) {
    try {
        console.log("📦 Dados recebidos NO BACKEND:", req.body);

        const caixa = await caixas.create(req.body);
        res.status(200).json({ mensagem: "cadastro de maquina feito com sucesso" });

    } catch (error) {
        console.log("❌ ERRO AO CRIAR MAQUINA:", error);
        res.status(500).send({ mensagem: `Erro ao adicionar maquina: ${error}` });
    }
}

    static async CarregarCaixa(req, res) {
        try {
            // Busca TODAS as máquinas
            const lista = await caixas.find();
            res.status(200).json(lista);
        } catch (error) {
            res.status(500).json({ mensagem: "erro ao exibir maquinas" });
        }
    }
}

export default OrdemControl;