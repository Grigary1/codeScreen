import mongoose from 'mongoose';

const interviewerSchema = new mongoose.Schema({
  interviewerId: { type: String, required: true },
  name: { type: String, required: true },        
  language: { type: String, required: true },     
  isPrivate: { type: Boolean, required: true }, 
  roomId: { 
    type: String, 
    unique: true, 
    default: () => new mongoose.Types.ObjectId().toString()  // Auto-generated roomId
  }
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

// Create a model
const Interviewer = mongoose.model('Interviewer', interviewerSchema);

export default Interviewer;
