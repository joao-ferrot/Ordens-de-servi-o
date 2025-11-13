import OrdemServico from "../models/model.js";
// get , put , delete, post
class OrdemControl {

    static async CarregarOrdens(req,res){
        try {
            const id=req.query.id

            const ordem= await OrdemServico.find(id)

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
            })
        } catch (error) {
            res.status(500).send({
                mensagem:"nao foi possivel criar  a ordem "
            })
        }
    }

    static async AtualizacaoOrdem(req,res){

        try{
            const {id}=req.params
            await OrdemServico.findByIdAndUpdate(id, req.body, {new: true});
            res.status(201).json({mensagem:`erro ao atualizar Ordem de serviço`})
            

        }catch{

        }
    }


 
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