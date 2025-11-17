const url="localhost:8000";

const api={

    async ObterOrdens(){

        try{
            const resposta=await fetch(/* url com o caminho aqui */);
            return await resposta.json();
        }catch(error){
            alert("erro ao obter ordens");
            console.log(error);

        }
    },

    async NovaOrdem(servico){
    try{
        const resposta = await fetch( url,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(servico)
        });
        return await resposta.json();



    }catch(error){
        alert("problema ao criar nova tarefa", error);
    }


   
},

 async deleteOrdem(id){
    try {
        const resposta=await fetch(url,{
            method:"DELETE"
        });
    return await resposta.json();
    } catch (error) {
        alert("de erro ao  excluir a ordem de serviço", error);

    }

        
    }

}

export default api