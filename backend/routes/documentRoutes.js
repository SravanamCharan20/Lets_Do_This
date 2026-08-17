import express from "express";
import Document from "../models/Document.js";
import { generateEmbedding } from "../utils/generateEmbedding.js";
import documentQueue from "../queues/documentQueue.js";
import { getCache, setCache } from "../utils/cache.js";
import rateLimiter from "../middleware/rateLimiter.js";
import { documentSearch } from "../utils/documentSearch.js";

const documentRouter = express.Router();

documentRouter.post("/upload-doc", async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "All fields are required !" });
    }

    const newDoc = await Document.create({
      title,
      content,
      category,
    });

    await documentQueue.add(
      "generate-embedding",
      {
        documentId: newDoc._id.toString(),
        text: `${title}\n${content}\n${category}`,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
      },
    );

    return res.status(201).json({
      message: "Document created and embedding job queued!",
      documentId: newDoc._id,
    });
    return res.status(201).json({ message: "Doc Created Successfully !" });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Uploading Doc !" });
  }
});

documentRouter.get("/fetch-doc", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;
    const skipPage = (page - 1) * limit;
    const doc = await Document.find({}).skip(skipPage).limit(limit).sort(({createdAt : -1}));
    const total = await Document.countDocuments();
    const totalPages = Math.ceil(total / limit);
    if (!doc || doc.length === 0) {
      return res.status(404).json({ message: "No docs !" });
    }
    return res.status(200).json({
      message: "Doc Created Successfully !",
      document: doc,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.log("Error : ", error);
    return res.status(500).json({ message: "Error While Fetching Doc !" });
  }
});

documentRouter.post("/search", rateLimiter, async (req, res) => {
  const MIN_SCORE = 0.6;
  try {
    const { query, category } = req.query;
    if (!query) {
      return res.status(400).json({ message: "No Query there !" });
    }
    const cacheKey = `search:${query}:${category || "all"}`;
    const cachedResults = await getCache(cacheKey);

    if (cachedResults) {
      return res.status(200).json({
        message: "search success - cache hit",
        filteredResults: cachedResults,
      });
    }
    const filteredResults = await documentSearch(query, category);
    // console.log(filteredResults)
    await setCache(cacheKey, filteredResults, 60);
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
