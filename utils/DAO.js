import  { connect } from "mongoose";

const connectToDB = async () => {
  await connect(
    "mongodb+srv://davidgege07:david00002@cluster0.gsernpa.mongodb.net/SGE"
  );
};
export default connectToDB;
