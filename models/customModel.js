import { Schema,models, model } from "mongoose";

const customerSchema = new Schema({
    customName: {
        type: String,
        required: true,
    },
  
    location: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    empresaId: {
        type: Schema.Types.ObjectId,
        ref: "Empresa",
        required: true,
    },
    nuit: {
        type: Number,
        required: false,
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

const Customer = models.Customer || model("Customer", customerSchema);
export default Customer;