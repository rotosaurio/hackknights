import mongoose from 'mongoose';

interface IUser {
  email: string;
  password: string;
  name: string;
  isDiabetic?: boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isDiabetic: {
    type: Boolean,
    default: null
  }
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
