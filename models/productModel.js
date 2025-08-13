import { Schema, models, model } from "mongoose";
const productSchema = new Schema({
    name: {
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
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ["ativo", "inativo", "descontinuado"],
      default: "ativo",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
      default: function () {
        return this.cost * this.quantity;
      },
    },
    price: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: function () {
        return this.price * this.quantity;
      },
    },
    quantityInStock: {
      type: Number,
      required: true,
    },
  stockMinimum: {
      type: Number,
      required: false,
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

  // Middleware para gerar SKU automático se não fornecido
  productSchema.pre('save', function(next) {
    if (!this.sku) {
      // Gerar SKU baseado no nome e timestamp
      const namePrefix = this.name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
      const timestamp = Date.now().toString().slice(-6);
      this.sku = `${namePrefix}${timestamp}`;
    }
    next();
  });
  
  const Product = models.Product || model("Product", productSchema);
  export default Product;
  