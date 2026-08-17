export const searchDocumentsTool = {
  name: "search_documents",

  description:
    "Search stored documents using semantic vector search. Use this when the user asks for information that may exist in the stored documents.",

  parameters: {
    type: "object",

    properties: {
      query: {
        type: "string",
        description: "What information to search for",
      },

      category: {
        type: "string",
        description:
          "Optional document category such as frontend, backend, database",
      },
    },

    required: ["query"],
  },
};
