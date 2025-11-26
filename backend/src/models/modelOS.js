import mongoose from "mongoose";

const OSchema = new mongoose.Schema(
  {
    maquina: { type: String, required: true },
    setor: { type: String, required: true },

    prioridade: { type: String, required: true },

    status: { type: String, required: true },

    data: { type: String, required: true },

    descricao: { type: String, required: true },
  },
  { versionKey: false }
);

const OrdemServico = mongoose.model("servicos", OSchema);

export default OrdemServico;
