import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [FormData, setFormData] = useState({
    name: '',
    rollno: '',
    gender: '',
    email: '',
    accountType: '',
    terms: false,
    fileUrl: '',
  });

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file.");
      return;
    }
    const Sas_Token = "sv=2024-11-04&ss=bfqt&srt=co&sp=rwdlacupiytfx&se=2026-08-07T14:31:48Z&st=2025-08-07T06:16:48Z&sip=0.0.0.0&spr=https,http&sig=vrLdekU4FMjjtN8it3LeN58QBJlCZUWork%2F0jHtoAqs%3D"
    const blobUrlWithSAS = `https://maggchar.blob.core.windows.net/resumes/${file.name}?${Sas_Token}`;

    try {
      const uploadRes = await fetch(blobUrlWithSAS, {
        method: 'PUT',
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": "application/pdf"
        },
        body: file
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text();
        throw new Error(`Azure Upload failed: ${uploadRes.status} ${errText}`);
      }

      const res = await fetch('http://localhost:8001/api/upload/posting', {
        method: 'POST',
        credentials:"include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...FormData,
          fileUrl: blobUrlWithSAS
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Form submission failed.");

      alert(data.message);

      setFormData({
        name: '',
        rollno: '',
        gender: '',
        email: '',
        accountType: '',
        terms: false,
        fileUrl: '',
      });
      setFile(null);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Upload failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center p-6">
      <form
        onSubmit={HandleSubmit}
        className="w-full max-w-2xl border border-black p-10 rounded-2xl space-y-10"
      >
        <h2 className="text-3xl font-bold text-center">Register Student</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xl font-medium">Name</label>
            <input
              type="text"
              value={FormData.name}
              onChange={(e) => setFormData({ ...FormData, name: e.target.value })}
              className="w-full border-b border-black bg-transparent py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-xl font-medium">Roll No</label>
            <input
              type="number"
              value={FormData.rollno}
              onChange={(e) => setFormData({ ...FormData, rollno: e.target.value })}
              className="w-full border-b border-black bg-transparent py-2 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xl font-medium">Email</label>
            <input
              type="email"
              value={FormData.email}
              onChange={(e) => setFormData({ ...FormData, email: e.target.value })}
              className="w-full border-b border-black bg-transparent py-2 outline-none"
            />
          </div>

          <div>
            <label className="text-xl font-medium">Gender</label>
            <select
              value={FormData.gender}
              onChange={(e) => setFormData({ ...FormData, gender: e.target.value })}
              className="w-full border-b cursor-pointer border-black bg-transparent py-2 outline-none"
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="text-xl font-medium">Account Type</label>
            <div className="flex gap-4 text-lg pt-2">
              {["Student", "Professional"].map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="accountType"
                    value={type}
                    checked={FormData.accountType === type}
                    onChange={(e) => setFormData({ ...FormData, accountType: e.target.value })}
                    className="accent-black cursor-pointer"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={FormData.terms}
            onChange={(e) => setFormData({ ...FormData, terms: e.target.checked })}
            className="accent-black cursor-pointer"
          />
          <label className="text-xl">
            I agree to the <span className="underline">terms and conditions</span>
          </label>
        </div>

        <div className="pt-2">
          <label className="text-xl font-medium">Upload Resume (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            required
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
            }}
            className="w-full mt-2 text-xl text-black file:border file:border-black file:rounded-md file:px-4 file:py-2 file:bg-transparent file:text-black hover:file:bg-black hover:file:text-white cursor-pointer"
          />
        </div>

        <div className="text-center pt-4">
          <button
            type="submit"
            className="border cursor-pointer border-black px-8 py-3 text-black font-medium rounded-full hover:bg-black hover:text-white transition-all duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
