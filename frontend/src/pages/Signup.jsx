import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Email: '',
    Password: '',
    role : ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8001/api/user/signup', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await res.json();
      alert(data.message);

      setFormData({ Username: '', Email: '', Password: '' ,role : ''});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-black border border-zinc-700 p-8 rounded-2xl space-y-8 shadow-xl"
      >
        <h2 className="text-3xl font-semibold text-center tracking-tight">Create Account</h2>

        <div className="space-y-2">
          <label className="text-lg font-light tracking-wide">Username</label>
          <input
            type="text"
            placeholder="john_doe"
            value={formData.Username}
            onChange={(e) => setFormData({ ...formData, Username: e.target.value })}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-light tracking-wide">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg font-light tracking-wide">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.Password}
            onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-lg font-light tracking-wide">Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white transition-all"
            required
          > 
            <option>-</option>
            <option value={"user"}>User</option>
            <option value={"admin"}>Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition duration-200 tracking-wide"
        >
          Sign Up
        </button>

        <p className="text-lg text-center font-light tracking-wide">
          Already have an account?{' '}
          <Link to="/signin" className="underline underline-offset-2 hover:text-gray-300 transition">
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
