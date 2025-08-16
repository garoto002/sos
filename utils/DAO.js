import { connect } from "mongoose";

const connectToDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb+srv://davidgege07:david00002@cluster0.gsernpa.mongodb.net/SOS";
  
  try {
    await connect(mongoUri);
    console.log("Conectado ao MongoDB:", mongoUri.includes('localhost') ? 'Local' : 'Atlas');
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
};

export default connectToDB;
