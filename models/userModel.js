import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
    nome: { type: String, required: true },
    contacto: { type: String, required: true }
});

const User = models.User || model("User", userSchema);
export default User;