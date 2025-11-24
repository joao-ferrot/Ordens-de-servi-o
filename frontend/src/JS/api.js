

const url="http://localhost:8000";

const api={

    
async Obtercaixas(){

        try{
            const response=await fetch(`${url}/Servicos`);
            return await response.json();
        }catch(error){
            alert("erro no carregamento das maquinas");
            console.log(error);

        }
    },

async Novacaixa(servico){
    try{
        const response = await fetch(` ${url}/NewCard`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(servico)
        });
        return await response.json();



    }catch(error){
        alert("problema ao cadastra uma nova maquina", error);
    }


   
},





    async ObterOrdens(){

        try{
            const response=await fetch(`${url}/Servicos`);
            return await response.json();
        }catch(error){
            alert("erro ao obter ordens");
            console.log(error);

        }
    },

async atualizaOrdem(servico){

    try {
        const response= await fetch(`${url}/UPservico/:id`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(servico)
    });
    return await response.json();
    } catch (error) {
        alert("erro ao atualizar a ordem");
        console.error(`${error}`);
    }
},


    async NovaOrdem(servico){
    try{
        const response = await fetch(` ${url}/NewCard`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(servico)
        });
        return await response.json();



    }catch(error){
        alert("problema ao criar nova tarefa", error);
    }


   
},

 async deleteOrdem(id){
    try {
        const response=await fetch(`${url}/delOs/:id`,{
            method:"DELETE"
        });
    return await response.json();
    } catch (error) {
        alert("de erro ao  excluir a ordem de serviço", error);

    }

        
    }

}

export default api