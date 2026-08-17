import express from "express";
import Document from "../models/Document.js";

const documentRouter = express.Router();

documentRouter.post("/upload-doc", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required !" });
    }

    const newDoc = await Document.create({ title, content });
    return res.status(201).json({ message: "Doc Created Successfully !" });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Uploading Doc !" });
  }
});

documentRouter.get("/fetch-doc", async (req, res) => {
  try {
    const doc = await Document.find({});
    if (!doc) {
      return res.status(400).json({ message: "No docs !" });
    }
    return res
      .status(200)
      .json({ message: "Doc Created Successfully !", document: doc });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Fetching Doc !" });
  }
});

export default documentRouter;
