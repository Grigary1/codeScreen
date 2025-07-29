import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  language: { type: String, required: true },
  isPrivate: { type: Boolean, required: true },
  isActive:{type:Boolean,required:true,default:true},
  roomId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  }
}, { _id: false });

const interviewerSchema = new mongoose.Schema({
  interviewerId: { type: String, required: true, unique: true },
  rooms: [roomSchema]
}, { timestamps: true });

const interviewerModel = mongoose.models.Interviewer || mongoose.model("Interviewer", interviewerSchema);

export default interviewerModel;