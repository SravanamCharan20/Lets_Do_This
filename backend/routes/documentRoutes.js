import express from "express";
import Document from "../models/Document.js";
import { generateEmbedding } from "../utils/generateEmbedding.js";

const documentRouter = express.Router();

documentRouter.post("/upload-doc", async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required !" });
    }
    const embedding = await generateEmbedding(`${title}\n${content}`);
    const newDoc = await Document.create({ title, content, embedding });
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

documentRouter.post("/search", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "No Query there !" });
    }

    const embeddedQuery = await generateEmbedding(query);

    const results = await Document.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: embeddedQuery,
          numCandidates: 50,
          limit: 5,
        },
      },
      {
        $project: {
          title: 1,
          content: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    return res.status(200).json({
      message : "search success",
      results,
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Searching Docs !" });
  }
});
export default documentRouter;
