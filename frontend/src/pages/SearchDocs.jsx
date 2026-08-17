/* eslint-disable no-unused-vars */
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";

const SearchDocs = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState([]);

  const handleSearch = useCallback(async () => {
    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:6969/docs/search?query=${encodeURIComponent(
          query,
        )}&category=${encodeURIComponent(category)}`,
        {
          method: "POST",
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to search documents");
      }

      const result = await response.json();

      console.log(result.results);

      setData(result.filteredResults || []);
      setSuccess(result.message || "");
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  },[query,category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [query,category,handleSearch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Search Documents
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Find the information you need from your documents
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-xl shadow-slate-200/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex flex-1 items-center">
              <svg
                className="ml-3 h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                />
              </svg>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-transparent px-3 py-3 text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
            >
              <option value="">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="devops">DevOps</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:shadow-md active:scale-[0.98]"
            >
              Search
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100">
              !
            </div>

            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-600">
            {success}
          </div>
        )}

        {/* Results */}
        <div className="mt-8">
          {data.length > 0 && (
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Search Results
              </h2>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                {data.length} results
              </span>
            </div>
          )}

          {/* No Results */}
          {!error && data.length === 0 && query && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-sm text-slate-500">
                No matching documents found.
              </p>
            </div>
          )}

          {/* Result Cards */}
          <div className="space-y-4">
            {data.map((doc) => (
              <div
                key={doc._id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-slate-900 transition group-hover:text-blue-600">
                        {doc.title}
                      </h2>

                      {doc.category && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {doc.category}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {doc.content}
                    </p>
                  </div>

                  {/* Similarity Score */}
                  <div className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                    {doc.score?.toFixed(3)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDocs;
