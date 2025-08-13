import { Schema,models, model } from "mongoose";


const supplierSchema=new Schema({
    supplierName: {
        type: String,
        required: true,
    },
    empresaId: {
        type: Schema.Types.ObjectId,
        ref: "Empresa",
        required: true,
    },
    // Campos de endereço
    bairro: {
        type: String,
        required: true,
    },
    avenue: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    // Campos de contato
    phone: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    // Informações da empresa
    company: {
        type: String,
        required: false,
    },
    nuit: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    // Campos adicionais
    status: {
        type: String,
        enum: ['ativo', 'inativo', 'pendente'],
        default: 'ativo',
    },
    country: {
        type: String,
        default: 'Moçambique',
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
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

const Supplier = models.Supplier || model("Supplier", supplierSchema);
export default Supplier;    