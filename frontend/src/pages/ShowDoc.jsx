/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

const ShowDoc = () => {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(`http://localhost:6969/docs/fetch-doc?page=${page}&limit=${limit}`);

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();

        setDocs(data.document);
        setPagination(data.pagination);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDocs();
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Documents</h1>

        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">{error}</p>
        )}

        <div className="grid gap-4">
          {docs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border rounded-xl p-5 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {doc.title}
              </h2>

              <p className="text-gray-600 mt-2">{doc.content}</p>
            </div>
          ))}
        </div>

        {docs.length === 0 && !error && (
          <p className="text-gray-500">No documents found.</p>
        )}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Previous
          </button>

          <span>
            Page {page} of {pagination.totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowDoc;
