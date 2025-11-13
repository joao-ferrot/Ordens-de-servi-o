import mongoose from "mongoose";


const DB=process.env.CONNECT_DB


async function conecta_db(){
    try {
       
        await mongoose.connect(DB);
        console.log("conexao com o banco de dados das ordens");
    } catch (error) {
        console.log("erro na conexao com o banco:",error);
        throw error
    }
    
}
export default  conecta_db;