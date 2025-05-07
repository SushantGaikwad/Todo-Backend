import mongoose, { Schema } from 'mongoose';

interface ITodo extends mongoose.Document {
  title: string;
  description: string;
  status: 'pending' | 'completed';
  dueDate: Date;
  owner: mongoose.Types.ObjectId;
}

const TodoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending',
  },
  dueDate: {
    type: Date,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model<ITodo>('Todo', TodoSchema);