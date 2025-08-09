import React from 'react';

const Header = () => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="rounded-full border-2 border-transparent bg-gradient-to-r from-purple-500 to-indigo-500 p-[2px] shadow-xl">
        <div className="flex items-center justify-center px-10 py-4 rounded-full bg-white dark:bg-zinc-700 backdrop-blur-md">
          <nav className="flex gap-8 text-xl text-gray-700 dark:text-white">
            <a href="/" className="hover:text-purple-500 transition">Home</a>
            <a href="/upload" className="hover:text-purple-500 transition">Upload</a>
            <a href="/details" className="hover:text-purple-500 transition">Details</a>
            <a href="/otp" className="hover:text-purple-500 transition">OTP</a>
            <a href="/signup" className="hover:text-purple-500 transition">SignUp</a>
            <a href="/chat" className="hover:text-purple-500 transition">Chat</a>
            <a href="/food" className="hover:text-purple-500 transition">FoodDetails</a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
