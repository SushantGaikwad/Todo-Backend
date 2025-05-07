import mongoose, { Schema } from 'mongoose';

interface ITokenBlacklist extends mongoose.Document {
  token: string;
  expiresAt: Date;
}

const TokenBlacklistSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<ITokenBlacklist>('TokenBlacklist', TokenBlacklistSchema);