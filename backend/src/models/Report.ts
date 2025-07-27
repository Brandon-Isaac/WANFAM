import { Schema, Document, model } from 'mongoose';

export interface IReportRequest extends Document {
  farmer: Schema.Types.ObjectId;
  officer?: Schema.Types.ObjectId;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'denied';
  reason?: string;
}

const reportRequestSchema = new Schema<IReportRequest>({
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  officer: { type: Schema.Types.ObjectId, ref: 'User' },
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  reason: String
}, { timestamps: true });

export const ReportRequest = model<IReportRequest>('ReportRequest', reportRequestSchema);