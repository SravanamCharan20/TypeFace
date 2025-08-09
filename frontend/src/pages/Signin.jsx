import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signin = () => {

    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8001/api/user/signin', {
        method: 'POST',
        credentials:"include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      alert(data.message);

      if(res.ok){
        navigate('/');
      }
      
      setFormData({ Email: '', Password: '' });
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
        <h2 className="text-3xl font-semibold text-center tracking-tight">Sign In</h2>

        <div className="space-y-2">
          <label className="text-sm font-light tracking-wide">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-light tracking-wide">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={formData.Password}
            onChange={(e) => setFormData({ ...formData, Password: e.target.value })}
            className="w-full bg-black border border-zinc-700 px-4 py-2 rounded-lg placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-white transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-medium py-2 rounded-lg hover:bg-gray-200 transition duration-200 tracking-wide"
        >
          Sign In
        </button>

        <p className="text-sm text-center font-light tracking-wide">
          Don’t have an account?{' '}
          <Link to="/signup" className="underline underline-offset-2 hover:text-gray-300 transition">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;
