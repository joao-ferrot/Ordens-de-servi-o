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
            });
            console.log(req.body);
        } catch (error) {
            res.status(500).send({
                mensagem:`nao foi possivel criar  a ordem : ${error}`
              
            })
            
        }
    }

    static async AtualizacaoOrdem(req,res){

        try{
            const id=req.params.id
           const resposta=await OrdemServico.findByIdAndUpdate(id,{$set: req.body}, {new: true});
           
            console.log(req.body);
            console.log(req.params.id);
            console.log(resposta)
            res.status(200).json({mensagem:`atualizaçao de ordem bem sucesidida`},{
                atualizaçao:resposta
            })


            const  r=  await OrdemServico.collection.updateOne(
                {
                    _id:req.params.id
                },
                {
                    $set:req.body
                }
            );
            console.log(r)

            return
            
            

        }catch(error){
            console.error(error)
          res.status(500).send("nao foi possivel realizar  a atualizaçao da ordem devido ao erro ")
       }
    }






   /*  static async AtualizacaoOrdem(req, res) {
        try {
            const id = req.params.id;
    
            const resposta = await OrdemServico.findByIdAndUpdate(
                id,
                { $set: req.body },
                { new: true }
            );
    
            res.status(200).json({
                mensagem: "Atualização realizada com sucesso",
                atualizacao: resposta
            });
   
            console.log(resposta)







            return; // IMPRESCINDÍVEL
    
        } catch (error) {
            console.error(error);
            res.status(500).send("Não foi possível atualizar a ordem.");
        }
    } */



















 
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


    static async buscarOrdem(req, res){
        try{

        }catch(error){

        }
    }
 
}


export default OrdemControl