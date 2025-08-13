import { Schema,models, model } from "mongoose";
import bcrypt from "bcrypt"; 

const userSchema=new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ["M", "F", "X"],
    },
    phone: {
        type: String,
    },
    role: {
        type: String,
        enum: ["admin", "user", "vendedor", "caixa", "estoquista", "comprador", "supervisor", "gerente", "contador", "superadmin"],
        required: true,
    },
    empresaId: {
        type: Schema.Types.ObjectId,
        ref: "Empresa",
    },
    createdAt: {
        type: Date,
        required: true,
    },
    updatedAt: {
        type: Date,
        required: true,
    },
});


userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 12);
});

const User = models.User || model("User", userSchema);
export default User;