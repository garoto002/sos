import { Schema, models, model } from "mongoose";

const productSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'A quantidade deve ser um número positivo ou zero.'],
  },
  cost: {
    type: Number,
    required: true,
    min: [0, 'O custo deve ser um número positivo ou zero.'],
  },
  ivaRate: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
});

const purchaseSchema = new Schema({
  supplierName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  totalAfterDiscount: {
    type: Number,
    required: true,
  },

  totalIva: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  debt: {
    type: Number,
    required: true,
  },
 
  products: [productSchema], // Array de produtos
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  empresaId: {
    type: Schema.Types.ObjectId,
    required: true, // Voltando para obrigatório
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

purchaseSchema.pre('save', function (next) {
  // Calcule subtotal, total de IVA, total antes e depois do desconto, e a dívida com base nos produtos
  const subtotal = this.products.reduce((acc, product) => acc + product.totalCost, 0);
  const totalIva = this.products.reduce((acc, product) => acc + (product.totalCost * product.ivaRate), 0);
  this.subtotal = subtotal;
  this.totalIva = totalIva;
  this.totalBeforeDiscount = subtotal + totalIva;
  this.totalAfterDiscount = this.totalBeforeDiscount - this.discount;
  this.debt =  this.amountPaid -this.totalAfterDiscount;
  next();
});

const Purchase = models.Purchase || model("Purchase", purchaseSchema);

export default Purchase;