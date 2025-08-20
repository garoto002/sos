import { connect } from "mongoose";

export const connectToDB = async () => {
  // await connect("mongodb://localhost:27017/sistema-web-pro-max");
  await connect(
    "mongodb+srv://davidgege07:david00002@cluster0.gsernpa.mongodb.net/SOS"
  );
};
