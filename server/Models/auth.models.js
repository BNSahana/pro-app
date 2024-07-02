import mongoose from 'mongoose';

const userSchemaOptions = {
  timestamps: true,
};

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, userSchemaOptions);

const User = mongoose.model('User', userSchema);

export default User;
