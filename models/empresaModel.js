import { Schema, models, model } from "mongoose";

const empresaSchema = new Schema({
  nome: { type: String, required: true },
  razaoSocial: { type: String },
  cnpj: { type: String },
  endereco: { type: String },
  telefone: { type: String },
  email: { type: String },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

const Empresa = models.Empresa || model("Empresa", empresaSchema);
export default Empresa;
