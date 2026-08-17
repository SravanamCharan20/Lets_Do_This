/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const Document = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setSuccess("");
    setError("");

    try {
      const response = await fetch("http://localhost:6969/docs/upload-doc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload document");
      }

      const data = await response.json();
      setSuccess(data.message);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white p-6 rounded-xl shadow-sm border">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Create Document
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>

            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter document title"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>

            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              placeholder="Write your document..."
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Submit
          </button>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {success && (
            <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              {success}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Document;
