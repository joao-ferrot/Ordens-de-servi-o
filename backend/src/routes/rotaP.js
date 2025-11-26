import OrdemRotas from "./rotasOrdem.js";

const routes=(server)=>{
 server.route('/').get((req,res)=>{
    const mensagem="servido ta vivo ( finalmente)"
    res.status(200).send(mensagem);

 })
 server.use(OrdemRotas)

}
export default routes