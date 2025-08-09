// src/pages/FoodForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function FoodDetails() {
  const [foodname, setFoodname] = useState("");
  const [desc, setDesc] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [preview, setPreview] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  async function checkSimilar() {
    setLoadingPreview(true);
    try {
      const res = await axios.post("/api/foods/similar", { foodname, desc, k: 5 });
      setPreview(res.data);
    } catch (err) {
      console.error(err);
      alert("Preview error");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function saveFood() {
    if (!foodname || !desc || !expiryDate) return alert("Fill fields");
    setSaving(true);
    try {
      await axios.post("/api/foods", { foodname, desc, ExpiryDate: expiryDate });
      alert("Saved");
      setFoodname("");
      setDesc("");
      setExpiryDate("");
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function runSearch() {
    if (!searchTerm) return;
    try {
      const res = await axios.get("/api/foods/search", { params: { q: searchTerm, k: 10 } });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Search failed");
    }
  }

  return (
    <div className="max-w-3xl mt-30 mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🍎 Add Food Item</h2>
      <p className="text-gray-600 mb-6">
        Fill in the details below. You can preview similar items before saving.
      </p>

      {/* Form Card */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4 border">
        <input
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Food name"
          value={foodname}
          onChange={(e) => setFoodname(e.target.value)}
        />

        <textarea
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Description"
          rows="3"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <input
          type="date"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={checkSimilar}
            disabled={loadingPreview}
            className={`px-4 py-2 rounded text-white ${
              loadingPreview
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {loadingPreview ? "Checking..." : "Check Similar"}
          </button>

          <button
            onClick={saveFood}
            disabled={saving}
            className={`px-4 py-2 rounded text-white ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {/* Similar Items Preview */}
      {preview.length > 0 && (
        <div className="mt-6 bg-gray-50 border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Similar Products</h3>
          <ul className="space-y-2">
            {preview.map((p) => (
              <li key={p._id} className="p-3 bg-white rounded shadow flex justify-between">
                <div>
                  <strong>{p.foodname}</strong> — {p.desc}
                </div>
                <span className="text-sm text-gray-500">Score: {(p.score ?? 0).toFixed(3)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <hr className="my-8" />

      {/* Search Existing Items */}
      <div className="bg-white shadow rounded-lg p-6 border">
        <h3 className="text-lg font-semibold mb-4">🔍 Search Existing Items</h3>
        <div className="flex gap-3">
          <input
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Search (e.g. bananas)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={runSearch}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <ul className="mt-4 space-y-2">
            {searchResults.map((r) => (
              <li key={r._id} className="p-3 bg-gray-50 rounded flex justify-between">
                <div>
                  <strong>{r.foodname}</strong> — {r.desc}
                </div>
                <span className="text-sm text-gray-500">Score: {(r.score ?? 0).toFixed(3)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
