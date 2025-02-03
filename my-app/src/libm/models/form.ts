import mongoose, { Schema, Document } from "mongoose";

interface ITestRecord extends Document {
  technicianName: string;
  floorName: string;
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  readingPressure: number;
  pipingImageUrl: string;
}

const TestRecordSchema = new Schema<ITestRecord>(
  {
    technicianName: { type: String, required: true },
    floorName: { type: String, required: true },
    startDate: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "14:30"
    endDate: { type: Date, required: true },
    endTime: { type: String, required: true }, // e.g., "16:00"
    readingPressure: { type: Number, required: true }, // Pressure in psi/bar
    pipingImageUrl: { type: String, required: true }, // Image URL
  },
  { timestamps: true }
);

export default mongoose.models.TestRecord || mongoose.model<ITestRecord>("TestRecord", TestRecordSchema);
