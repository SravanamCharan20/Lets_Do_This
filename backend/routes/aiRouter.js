import express from "express";
import ai from "../utils/gemini.js";
import { searchDocumentsTool } from "../tools/searchDocumentsTool.js";
import { documentSearch } from "../utils/documentSearch.js";

const aiRouter = express.Router();

aiRouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        tools: [
          {
            functionDeclarations: [searchDocumentsTool],
          },
        ],
      },
    });
    // console.log(response);
    const functionCall = response.functionCalls?.[0];

    if (!functionCall) {
      return res.status(200).json({
        response: response.text,
      });
    }
    const result = await documentSearch(
      functionCall.args.query,
      functionCall.args.category,
    );

    const finalResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",

      contents: [
        {
          role: "user",
          parts: [
            {
              text: message,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              functionCall: {
                name: functionCall.name,

                args: functionCall.args,
              },
            },
          ],
        },
        {
          role: "user",
          parts: [
            {
              functionResponse: {
                name: functionCall.name,

                response: {
                  results: result,
                },
              },
            },
          ],
        },
      ],
      config: {
        tools: [
          {
            functionDeclarations: [searchDocumentsTool],
          },
        ],
      },
    });

    // 5. Send Gemini's FINAL answer to frontend

    return res.status(200).json({
      response: finalResponse.text,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Gemini error",
    });
  }
});

export default aiRouter;
