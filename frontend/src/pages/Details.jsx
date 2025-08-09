import React, { useEffect, useState } from 'react';


const Details = () => {
  const [data, setData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/upload/getting',{
          credentials:"include"
        });
        const jsonData = await res.json();

        setData(jsonData);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, []);

  const startEditing = (entry) => {
    setEditingId(entry._id);
    setEditFormData({ ...entry });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === "terms" ? value === "true" : value,
    }));
  };

  const HandleEdit = async (id) => {
    try {

    if (editFormData.file) {
      const blobUrl = `https://maggchar.blob.core.windows.net/resumes/${editFormData.file.name}?sp=racwdl&st=2025-08-06T11:01:27Z&se=2025-08-06T19:16:27Z&sv=2024-11-04&sr=c&sig=3evS%2FDmd6TYrNAeLfRWT5fLN4lWN%2FZaBo5ka5MAq7ag%3D`;

      const uploadRes = await fetch(blobUrl, {
        method: 'PUT',
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": "application/pdf",
        },
        body: editFormData.file
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload updated PDF");
      }

        console.log("✅ Updated PDF uploaded");
      }

      const updatedPayload = {...editFormData}
      delete updatedPayload.file;

    
      const res = await fetch(`http://localhost:8001/api/upload/update/${id}`, {
        method: 'PUT',
        credentials:"include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPayload),
      });

      if (res.ok) {
        const updatedData = data.map((item) =>
          item._id === id ? updatedPayload : item
        );
        setData(updatedData);
        cancelEditing();
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const HandleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8001/api/upload/delete/${id}`, {
        method: 'DELETE',
        credentials:"include",
      });

      if (res.ok) {
        const updatedData = data.filter((item) => item._id !== id);
        setData(updatedData);
      }

      const res1 = await res.json();
      console.log(res1.message);

    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 py-10 px-4 md:px-16">
  <h2 className="text-4xl font-bold mb-20 text-center text-black dark:text-white tracking-tight">
    
  </h2>

  <div className="overflow-x-auto border border-black/10 dark:border-white/10 rounded-2xl">
    <table className="min-w-full text-xl text-left text-black dark:text-white">
      <thead className="bg-white dark:bg-zinc-800">
        <tr>
          {["Name", "Roll No", "Email", "Gender", "Account", "Terms", "Delete", "Overview", "Edit"].map((header) => (
            <th key={header} className="px-6 py-5 font-semibold border-b border-black/10 dark:border-white/10">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="9" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
              No entries yet.
            </td>
          </tr>
        ) : (
          data.map((entry) => (
            <tr key={entry._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition">
              {editingId === entry._id ? (
                <>
                  <td className="px-6 py-4">
                    <input
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditChange}
                      className="bg-transparent border-b border-black/30 dark:border-white/30 w-full px-2 py-1 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      name="rollno"
                      value={editFormData.rollno}
                      onChange={handleEditChange}
                      className="bg-transparent border-b border-black/30 dark:border-white/30 w-full px-2 py-1 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      name="email"
                      type="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="bg-transparent border-b border-black/30 dark:border-white/30 w-full px-2 py-1 outline-none"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-6 items-center">
                      {["Male", "Female"].map((g) => (
                        <label key={g} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={editFormData.gender === g}
                            onChange={handleEditChange}
                            className="accent-black dark:accent-white"
                          />
                          <span>{g}</span>
                        </label>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      name="accountType"
                      value={editFormData.accountType}
                      onChange={handleEditChange}
                      className="bg-transparent border-b border-black/30 dark:border-white/30 w-full px-2 py-1 outline-none"
                    >
                      <option value="">Select</option>
                      <option value="Professional">Professional</option>
                      <option value="Student">Student</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="terms"
                        checked={editFormData.terms}
                        onChange={(e) =>
                          setEditFormData({ ...editFormData, terms: e.target.checked })
                        }
                        className="accent-black dark:accent-white"
                      />
                      <span>Accepted</span>
                    </label>
                  </td>
                  
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const newFile = e.target.files[0];
                        setEditFormData((prev) => ({
                          ...prev,
                          file: newFile,
                          fileUrl: `https://maggchar.blob.core.windows.net/resumes/${newFile.name}?sp=racwdl&st=2025-08-06T11:01:27Z&se=2025-08-06T19:16:27Z&sv=2024-11-04&sr=c&sig=3evS%2FDmd6TYrNAeLfRWT5fLN4lWN%2FZaBo5ka5MAq7ag%3D`,
                        }));
                      }}
                      className="block w-full text-sm text-black file:rounded-full file:px-4 file:py-2 file:bg-black file:text-white hover:file:bg-zinc-800 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => HandleEdit(entry._id)}
                      className="px-4 py-2 rounded-full bg-black text-white hover:bg-zinc-800 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-full border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-zinc-700 transition"
                    >
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4">{entry.name}</td>
                  <td className="px-6 py-4">{entry.rollno}</td>
                  <td className="px-6 py-4">{entry.email}</td>
                  <td className="px-6 py-4">{entry.gender}</td>
                  <td className="px-6 py-4">{entry.accountType}</td>
                  <td className="px-6 py-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      entry.terms ? 'bg-black text-white' : 'bg-white border border-black text-black'
                    }`}>
                      {entry.terms ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => HandleDelete(entry._id)}
                      className="px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {entry.fileUrl ? (
                      <a
                        href={entry.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-center px-4 py-2 rounded-full bg-amber-400 text-white hover:bg-amber-500"
                      >
                        View File
                      </a>
                    ) : (
                      <span className="italic text-gray-400">No File</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => startEditing(entry)}
                      className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>

  );
};

export default Details;
