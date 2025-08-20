import { Schema, models, model } from "mongoose";

const pessoaSchema = new Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true },
  foto: { type: String, required: true },
  status: { type: String, enum: ["perdido", "achado"], required: true },
  createdAt: { type: Date, default: Date.now },
  ultimoLocal: { type: String },
  roupa: { type: String },
  contacto: { type: String },
  visualizacoes: { type: Number, default: 0 },
  comentarios: [
    {
      texto: String,
      data: { type: Date, default: Date.now },
      autor: String
    }
  ],
});

const Pessoa = models.Pessoa || model("Pessoa", pessoaSchema);
export default Pessoa;
