import mongoose from 'mongoose';

export interface IQuizResponse {
  userName: string;
  responses: Record<string, any>;
  isDiabetic: boolean;
  createdAt: Date;
}

const QuizResponseSchema = new mongoose.Schema<IQuizResponse>({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  responses: {
    type: Object,
    required: true
  },
  isDiabetic: {
    type: Boolean,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const DiabetesQuizResponse = mongoose.models.DiabetesQuizResponse || 
  mongoose.model<IQuizResponse>('DiabetesQuizResponse', QuizResponseSchema);

export const NonDiabetesQuizResponse = mongoose.models.NonDiabetesQuizResponse || 
  mongoose.model<IQuizResponse>('NonDiabetesQuizResponse', QuizResponseSchema);