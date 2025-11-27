const url = "http://localhost:8000";

const api = {

    // --- EQUIPAMENTOS ---
    async Obtercaixas() {
        try {
            const response = await fetch(`${url}/equipamentos`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar equipamentos:", error);
            return [];
        }
    },

    async Novacaixa(servico) {
        try {
            const response = await fetch(`${url}/equipamentos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(servico)
            });
            return await response.json();
        } catch (error) {
            alert("Problema ao cadastrar máquina");
            console.error(error);
        }
    },

    // CORREÇÃO AQUI: Removida a palavra 'function' e trocado BASE_URL por url
    async DeletarCaixa(id) {
        try {
            const response = await fetch(`${url}/equipamentos/${id}`, { 
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Erro ao deletar equipamento na API");
            }
            
            return await response.json();
        } catch (error) {
            console.error("Erro ao deletar:", error);
            throw error; // Lança o erro para o front tratar
        }
    },

    // --- ORDENS DE SERVIÇO ---
    async ObterOrdens() {
        try {
            const response = await fetch(`${url}/ordens`);
            return await response.json();
        } catch (error) {
            console.error("Erro ao buscar ordens:", error);
            return [];
        }
    },

    async NovaOrdem(servico) {
        try {
            const response = await fetch(`${url}/ordens`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(servico)
            });
            return await response.json();
        } catch (error) {
            alert("Problema ao criar nova tarefa");
            console.error(error);
        }
    },

    async atualizaOrdem(id, servico) {
        try {
            const response = await fetch(`${url}/ordens/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(servico)
            });
            return await response.json();
        } catch (error) {
            alert("Erro ao atualizar a ordem");
            console.error(error);
        }
    },

    async deleteOrdem(id) {
        try {
            const response = await fetch(`${url}/ordens/${id}`, {
                method: "DELETE"
            });
            return await response.json();
        } catch (error) {
            alert("Erro ao excluir a ordem");
            console.error(error);
        }
    }
}

export default api;