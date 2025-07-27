import { Schema, Document, model } from 'mongoose';

export interface IHealthRecord extends Document {
  animal: Schema.Types.ObjectId;
  vet?: Schema.Types.ObjectId;
  diagnosis?: string;
  treatment?: string;
  medication?: string;
  cost?: number;
  visitDate: Date;
  nextCheckup?: Date;
}

const healthRecordSchema = new Schema<IHealthRecord>({
  animal: { type: Schema.Types.ObjectId, ref: 'Livestock', required: true },
  vet: { type: Schema.Types.ObjectId, ref: 'User' },
  diagnosis: String,
  treatment: String,
  medication: String,
  cost: Number,
  visitDate: { type: Date, required: true },
  nextCheckup: Date
}, { timestamps: true });

export const HealthRecord = model<IHealthRecord>('HealthRecord', healthRecordSchema);
