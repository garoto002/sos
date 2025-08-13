import { Schema, models, model } from "mongoose";

const vacationPlanSchema = new Schema({
  workerName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  notes: { type: String },
});

const VacationPlan = models.VacationPlan || model("VacationPlan", vacationPlanSchema);

export default VacationPlan;
