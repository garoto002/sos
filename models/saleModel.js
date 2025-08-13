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
  price: {
    type: Number,
    required: true,
    min: [0, 'O preço deve ser um número positivo ou zero.'],
  },
  ivaRate: {
    type: Number,
    required: true,
    min: [0, 'A taxa de IVA deve ser um número positivo ou zero.'],
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'O preço total deve ser um número positivo ou zero.'],
  },
});

const saleSchema = new Schema({
  invoiceNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  customName: {
    type: String,
    required: true,
  },
  empresaId: {
    type: Schema.Types.ObjectId,
    ref: "Empresa",
    required: true,
  },
  description: {
    type: String,
  },
  discount: {
    type: Number,
    min: [0, 'O desconto deve ser um número positivo ou zero.'],
  },
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'O subtotal deve ser um número positivo ou zero.'],
  },
  totalAfterDiscount: {
    type: Number,
    required: true,
    min: [0, 'O total após desconto deve ser um número positivo ou zero.'],
  },
  totalBeforeDiscount: {
    type: Number,
    required: true,
    min: [0, 'O total antes do desconto deve ser um número positivo ou zero.'],
  },
  totalIva: {
    type: Number,
    required: true,
    min: [0, 'O total de IVA deve ser um número positivo ou zero.'],
  },
  change: {
    type: Number,
    required: true,
    min: [0, 'O troco deve ser um número positivo ou zero.'],
  },
  receivedAmount: {
    type: Number,
    required: true,
    min: [0, 'O valor recebido deve ser um número positivo ou zero.'],
  },
  debtOrChange: {
    type: Number,
    required: true,
    default: function () {
      return this.receivedAmount - this.totalAfterDiscount;
    },
  },
  products: [productSchema], // Array de produtos
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

saleSchema.pre('save', function (next) {
  // Calcule subtotal e total com base nos produtos
  const subtotal = this.products.reduce((acc, product) => acc + product.totalPrice, 0);
  const totalIva = this.products.reduce((acc, product) => acc + product.totalPrice * product.ivaRate, 0);
  this.subtotal = subtotal;
  this.totalBeforeDiscount = subtotal + totalIva;
  this.totalAfterDiscount = this.totalBeforeDiscount - this.discount;
  this.totalIva = totalIva;
  this.change = this.receivedAmount - this.totalAfterDiscount;
  this.debtOrChange = this.receivedAmount - this.totalAfterDiscount;

  next();
});


const Sale = models.Sale || model("Sale", saleSchema);

export default Sale;