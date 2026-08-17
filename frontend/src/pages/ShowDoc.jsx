/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

const ShowDoc = () => {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await fetch(
          "http://localhost:6969/docs/fetch-doc"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }

        const data = await response.json();

        setDocs(data.document);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchDocs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Documents</h1>

        {error && (
          <p className="text-red-500 bg-red-50 p-3 rounded-lg mb-4">
            {error}
          </p>
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

              <p className="text-gray-600 mt-2">
                {doc.content}
              </p>
            </div>
          ))}
        </div>

        {docs.length === 0 && !error && (
          <p className="text-gray-500">No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default ShowDoc;