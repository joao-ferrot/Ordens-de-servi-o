import mongoose from "mongoose";

const box= new mongoose.Schema({
   nome:{
    type:String,required:true
   },
   setor:{
    type:String,required:true
   }
},{versionKey:false});

const caixas=mongoose.model("cartoes",box);

export default caixas;