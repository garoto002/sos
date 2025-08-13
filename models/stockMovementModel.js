// models/StockMovement.js

import { Schema, models, model } from 'mongoose';

const StockMovementSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  sale: {
    type: Schema.Types.ObjectId,
    ref: 'Sale',
  },
  purchase: {
    type: Schema.Types.ObjectId,
    ref: 'Purchase',
  },
  type: {
    type: String,
    enum: ['purchase', 'sale', 'adjustment'],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const StockMovement = models.StockMovement || model('StockMovement', StockMovementSchema);
export default StockMovement;
