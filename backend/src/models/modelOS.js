import mongoose from "mongoose";

const OSchema= new mongoose.Schema({

    id:{type:mongoose.Schema.Types.ObjectId},
    maquina:{type:String, required: true},
    setor:{ type:String, required:true},
    Prioridade:{type:String , required:true},
    status:{ type: String, required:true },
    Data:{  type: String, required: true },
    Detalhes:{type:String, required: true}
},{versionKey:false});
const OrdemServico = mongoose.model("servicos",OSchema);

export default OrdemServico;
