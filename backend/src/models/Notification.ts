import { Schema, Document, model } from 'mongoose';

export interface INotification extends Document {
  recipient: Schema.Types.ObjectId;
  message: string;
  type: 'feeding' | 'vaccine' | 'health' | 'system';
  isRead: boolean;
  linkTo?: string;
}

const notificationSchema = new Schema<INotification>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  message: { type: String },
  type: { type: String, enum: ['feeding', 'vaccine', 'health', 'system'], required: true },
  isRead: { type: Boolean, default: false },
  linkTo: { type: String }
}, { timestamps: true });

export const Notification = model<INotification>('Notification', notificationSchema);
