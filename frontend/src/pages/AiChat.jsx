import { useState } from "react";

const AiChat = () => {
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setError("");
      setData(null);

      const response = await fetch("http://localhost:6969/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to get response");
      }

      setData(result);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 0 1-4.38-1.01L3 20l1.37-4.11A7.75 7.75 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            AI Document Assistant
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Ask questions and find relevant information from your documents
          </p>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              placeholder="Ask something about your documents..."
              className="flex-1 bg-transparent px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400"
            />

            <button
              onClick={handleSubmit}
              disabled={!query.trim()}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ask AI
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* AI Response */}
        {data?.response && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.9 9.9 0 0 1-4.38-1.01L3 20l1.37-4.11A7.75 7.75 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  AI Assistant
                </p>

                <p className="text-sm font-medium text-slate-800">
                  Answer
                </p>
              </div>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {data.response}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiChat;