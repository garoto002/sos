import { Schema, models, model } from "mongoose";

const payrollSchema = new Schema({
  position: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  baseSalary: { type: Number, required: true },
  overtimeHours: { type: Number, default: 0 },
  bonuses: { type: Number, default: 0 },
  otherBenefits: { type: Number, default: 0 },
  totalGrossSalary: { type: Number, required: true },
  totalBenefits: { type: Number, default: 0 },
  inssContribution: { type: Number, default: 0 },
  unionDues: { type: Number, default: 0 },
  otherDeductions: { type: Number, default: 0 },
  totalDeductions: { type: Number, required: true },
  netSalary: { type: Number, required: true },
  irt: { type: Number, required: true },
  commissions: { type: Number, required: true },
});

payrollSchema.pre('save', function (next) {
  // Calcule subtotal e total com base nos produtos
  this.totalBenefits = this.overtimeHours + this.bonuses  + this.otherBenefits + this.commissions;
  this.totalGrossSalary = this.baseSalary + this.totalBenefits;
  this.inssContribution = this.totalGrossSalary * 0.03;
  this.totalDeductions = this.inssContribution+ this.irt + this.unionDues + this.otherDeductions;
  this.netSalary = this.totalGrossSalary - this.totalDeductions;
  
  next();
});

const Payroll = models.Payroll || model("Payroll", payrollSchema);
export default Payroll;