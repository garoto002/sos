import { Schema,models, model } from "mongoose";


const workerSchema=new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    
    birthdate: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ["M", "F", "x"],
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    level: {
        type: String,
        enum: ["basico", "tecnico", "medio", "licenciado", "mestrado", "doutorado"],
        required: true,
    },

    admission: {
        type: Date,
        required: true,
    },
    contract: {
        type: Number,
        required: true,
    },
  
    category: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
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
benefits: {
  type: Number,
  default: 0,
},
deductions: {
  type: Number,
  default: 0,
},
    
});


const Worker = models.Worker || model("Worker", workerSchema);
export default Worker;