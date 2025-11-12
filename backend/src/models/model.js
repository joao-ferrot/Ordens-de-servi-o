import mongoose from "mongoose";

const OSchema= new mongoose.Schema({

    id:{type:mongoose.Schema.Types.ObjectId},
    maquina:{
        type:String, required: true
    },
    setor:{
        type:String, required:true
    },
    data_de_abertura:{
        type:Number, required:true
    },
    status:{
        type: String, required:true
    }
}
,{versionKey:false});
const OrdemServico = mongoose.model("Ordem_de_Servico",OSchema);

export default OrdemServico