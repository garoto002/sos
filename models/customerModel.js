import { Schema,models, model } from "mongoose";

const customerSchema=new Schema({
    customerName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    address: {
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
    category: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'pendente'],
        default: 'ativo',
    },
    notes: {
        type: String,
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
