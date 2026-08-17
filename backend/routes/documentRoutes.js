import express from "express";
import Document from "../models/Document.js";
import { generateEmbedding } from "../utils/generateEmbedding.js";

const documentRouter = express.Router();

documentRouter.post("/upload-doc", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required !" });
    }
    const embedding = await generateEmbedding(`${title}\n${content}\n${category}`);
    await Document.create({ title, content, category, embedding });
    return res.status(201).json({ message: "Doc Created Successfully !" });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Uploading Doc !" });
  }
});

documentRouter.get("/fetch-doc", async (req, res) => {
  try {
    const doc = await Document.find({});
    if (!doc || doc.length === 0) {
      return res.status(404).json({ message: "No docs !" });
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
  const MIN_SCORE = 0.6;
  try {
    const { query, category } = req.query;
    if (!query) {
      return res.status(400).json({ message: "No Query there !" });
    }

    const embeddedQuery = await generateEmbedding(query);

    const vectorSearchStage = {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: embeddedQuery,
        numCandidates: 50,
        limit: 5,
      },
    };

    if (category) {
      vectorSearchStage.$vectorSearch.filter = {
        category: { $eq: category },
      };
    }

    const results = await Document.aggregate([
      vectorSearchStage,
      {
        $project: {
          title: 1,
          content: 1,
          category: 1,
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },
    ]);

    const filteredResults = results.filter((res) => res.score >= MIN_SCORE);
    console.log(filteredResults)
    return res.status(200).json({
      message: "search success",
      filteredResults,
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Searching Docs !" });
  }
});
export default documentRouter;
