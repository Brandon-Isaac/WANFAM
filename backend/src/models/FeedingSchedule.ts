import { Schema, Document, model } from 'mongoose';

export interface IFeedingSchedule extends Document {
  animal: Schema.Types.ObjectId;
  feedType: string;
  quantity: string;
  timeOfDay: string;
  assignedBy?: Schema.Types.ObjectId;
  cost?: number;
  recurring: boolean;
  active: boolean;
}

const feedingScheduleSchema = new Schema<IFeedingSchedule>({
  animal: { type: Schema.Types.ObjectId, ref: 'Livestock', required: true },
  feedType: String,
  quantity: String,
  timeOfDay: String,
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  cost: Number,
  recurring: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

export const FeedingSchedule = model<IFeedingSchedule>('FeedingSchedule', feedingScheduleSchema);
