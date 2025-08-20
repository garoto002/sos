import { connect } from "mongoose";

const connectToDB = async () => {
  await connect(process.env.MONGODB_URI);
};

export default connectToDB;
