import { Schema, models, model } from "mongoose";

const empresaSchema = new Schema({
  nome: { type: String, required: true },
  nuit: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[0-9]{9}$/.test(v);
      },
      message: props => `${props.value} não é um NUIT válido! Deve ter 9 dígitos.`
    }
  },
  alvara: { type: String },
  endereco: {
    provincia: { 
      type: String, 
      required: true,
      enum: [
        "Maputo Cidade",
        "Maputo Província",
        "Gaza",
        "Inhambane",
        "Manica",
        "Sofala",
        "Tete",
        "Zambézia",
        "Nampula",
        "Cabo Delgado",
        "Niassa"
      ]
    },
    distrito: { type: String, required: true },
    bairro: { type: String, required: true },
    avenidaRua: { type: String }
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
    required: true,
  },
  telefone1: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^(?:\+258|8[234567]\d{7})$/.test(v);
      },
      message: props => `${props.value} não é um número de telefone moçambicano válido!`
    }
  },
  telefone2: { 
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^(?:\+258|8[234567]\d{7})$/.test(v);
      },
      message: props => `${props.value} não é um número de telefone moçambicano válido!`
    }
  },
  email: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} não é um email válido!`
    }
  },
  logo: {
    url: { type: String },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number }
  },
  coverImage: {
    url: { type: String },
    alt: { type: String },
    width: { type: Number },
    height: { type: Number }
  },
  ativo: { type: Boolean, default: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
});

const Empresa = models.Empresa || model("Empresa", empresaSchema);
export default Empresa;
