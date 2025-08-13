import { Schema, models, model } from "mongoose";

const attendanceSchema = new Schema({
  date: { type: Date, default: Date.now, required: true }, // Mantendo a data
  workerName: { type: String, required: true },
  isPresent: { type: Boolean, default: false },
  arrivalTime: { type: Date }, // Nova propriedade para a hora de chegada
  notes: { type: String },
});

const Attendance = models.Attendance || model("Attendance", attendanceSchema);

export default Attendance;
