import { Schema, models, model } from "mongoose";

const productAdjustmentSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'A quantidade deve ser um número positivo ou zero.'],
  },
  reason: {
    type: String,
    required: true,
  },
});

const stockAdjustmentSchema = new Schema({
  adjustments: [productAdjustmentSchema], // Array de ajustes de produtos
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
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

const StockAdjustment = models.StockAdjustment || model("StockAdjustment", stockAdjustmentSchema);

export default StockAdjustment;
