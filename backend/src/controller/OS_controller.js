import OrdemServico from "../models/modelOS.js";
import caixas from "../models/modelCartao.js";

// get , put , delete, post
class OrdemControl {

    static async CarregarOrdens(req,res){
        try {
            const ordem= await OrdemServico.find()

            res.status(200).json(ordem)
        } catch (error) {
            res.status(500).json({mensagem:"erro ao carrega a lista"});

        }
    }

    static async CriarOrdem(req,res){
        try {
            const novaOrdem =req.body
            const ordem=await OrdemServico.create(novaOrdem);
            res.status(200).json({
                mensagem:"ordem criada"
            });
            console.log(req.body);
        } catch (error) {
            res.status(500).send({
                mensagem:`nao foi possivel criar  a ordem : ${error}`
              
            })
            
        }
    }
//card
static async CriarCaixa(req,res){
        try {
            const novaCaixa =req.body
            const caixa=await caixas.create(novaCaixa);
            res.status(200).json({
                mensagem:"cadastro de maquina feito com sucesso"
            });
            console.log(req.body);
        } catch (error) {
            res.status(500).send({
                mensagem:`nao foi possivel adiciona nova maquina: ${error}`
              
            })
            
        }
    }

 static async CarregarCaixa(req,res){
        try {
            const maquina=req.query.maquina

            const caixa= await caixas.find(maquina);

            res.status(200).json(caixa);
        } catch (error) {
            res.status(500).json({mensagem:"erro ao exibir os cartoes de maquinas"});

        }
    }




//fim do card











   /*  static async buscarOrdem(req, res) {
        try {
          const { id } = req.params;
    
          if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ erro: 'id inválido' });
          }
    
          const ordem = await OrdemServico.findById(id);
          if (!ordem) return res.status(404).json({ erro: "id da ordem não encontrado" });
    
          return res.status(200).json(ordem);
        } catch (error) {
          console.error('buscarOrdem:', error);
          return res.status(500).json({ erro: 'falha ao buscar ordem', detalhe: error.message });
        }
      } */






static async buscarOrdem(req,res){
    try {
        const id=req.params.id
        const ordem=await OrdemServico.findById(id);
        if(!ordem){return res.status(404).json({erro:"id da ordem nao encontrado"})}
        
         return res.status(200).json(ordem);

      
    } catch (error) {
        res.status(500).json(` falha ao buscas Ordem:  ${error}`);
        console.log(error)
    }
}


    static async AtualizacaoOrdem(req,res){

        try{
        const id=req.params.id
           const resposta=await OrdemServico.findByIdAndUpdate(id,{$set: req.body}, {new: true});
           
            console.log(req.body);
            console.log(req.params.id);
            console.log(resposta)
         

            return res.status(201).json({mensagem: "Atualização feita!", dados: resposta})
            
            

        }catch(error){
            console.error(error)
          res.status(500).send("nao foi possivel realizar  a atualizaçao da ordem devido ao erro ")
       }
    }





/* 
    static async buscarOrdem(req,res){
    try {
        const {id}=req.params
        const ordem=await OrdemServico.findById(id);
        if(!ordem){return res.status(404).json({erro:"id da ordem nao encontrado"});
    }
        return res.status(200).json(ordem);

    } catch (error) {
        console.log(error)
        return res.status(500).json(`falha ao buscar Ordem: ${error}`);
    }
}
 */


















 
    static async deletarOrdem(req,res){
        try {
            const ordem= await OrdemServico.findByIdAndDelete(req.params.id)
            res.status(200).json(`ordem deletada com sucesso`);

        } catch (error) {
            res.status(500).send({
                mensagem:`deu marda ao deletar a task ${error}`
            })
        }
    }



}


export default OrdemControl