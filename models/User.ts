import mongoose from 'mongoose';

interface IUser {
  email: string;
  password: string;
  name: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}, {
  collection: 'usuarios'
});

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
