import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    category : {
      type : String,
    },
    embedding : {
      type : [Number]
    }
  },
  { timestamps: true },
);

const Document = mongoose.model("Document", documentSchema);
export default Document;
