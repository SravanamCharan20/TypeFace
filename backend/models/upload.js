import mongoose from 'mongoose';

const UploadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rollno: {
      type: Number,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    accountType: {
      type: String,
      required: true,
      enum: ['Student', 'Professional'], 
    },
    terms: {
      type: Boolean,
      required: true,
    },
    fileUrl:{
      type:String,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Detail', UploadSchema);