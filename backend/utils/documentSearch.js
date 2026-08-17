import Document from "../models/Document.js";
import { generateEmbedding } from "./generateEmbedding.js";

export const documentSearch = async (query, category) => {
  const MIN_SCORE = 0.6;
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
  return filteredResults;
};
