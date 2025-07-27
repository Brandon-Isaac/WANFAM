import { Schema, model, Document } from 'mongoose';
import { UserRole } from './UserRoles';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  preferredLanguage?: 'english' | 'swahili';
  isActive: boolean;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  preferredLanguage: { type: String, enum: ['english', 'swahili'], default: 'english' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);
