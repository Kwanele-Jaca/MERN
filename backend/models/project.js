import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  budget: { type: Number, required: true },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  expectedCompletion: { type: Date, required: true },
  images: [String],
  pdfs: [String],
   coordinates: {
    lat: Number,
    lng: Number
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

const Project = mongoose.model("Project", projectSchema);
export default Project;
