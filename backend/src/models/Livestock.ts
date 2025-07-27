import { Schema, Document, model } from 'mongoose';
export interface ILivestock extends Document {
  farmer: Schema.Types.ObjectId;
  tagId: string;
  name?: string;
  breed?: string;
  gender: 'male' | 'female';
  birthDate?: Date;
  purchaseDate?: Date;
  productivityStats?: {
    milkOutput: { date: Date; liters: number }[];
    weightRecords: { date: Date; weight: number }[];
  };
  notes?: string;
}

const livestockSchema = new Schema<ILivestock>({
  farmer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  tagId: { type: String, required: true, unique: true },
  name: String,
  breed: String,
  gender: { type: String, enum: ['male', 'female'], required: true },
  birthDate: Date,
  purchaseDate: Date,
  productivityStats: {
    milkOutput: [{ date: Date, liters: Number }],
    weightRecords: [{ date: Date, weight: Number }]
  },
  notes: String
}, { timestamps: true });

export const Livestock = model<ILivestock>('Livestock', livestockSchema);
