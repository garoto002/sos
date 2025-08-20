import { connect } from "mongoose";

const connectToDB = async () => {
  try {
    await connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    throw error;
  }
};

export default connectToDB;