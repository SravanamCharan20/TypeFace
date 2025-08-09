import React, { useState } from 'react';

const Otp = () => {
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // 👈 for backend error messages

  const HandleOtp = async (e) => {
    e.preventDefault();

    try {
      setErrorMsg(''); // clear previous errors

      const res = await fetch('http://localhost:8001/api/generate/otp', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();

      if (res.ok) {
        setOtp(data.otp);     // ✅ show OTP
        setErrorMsg('');      // clear error if any
      } else {
        setOtp('');
        setErrorMsg(data.error || 'OTP generation failed');
      }
    } catch (error) {
      setOtp('');
      setErrorMsg('Server error or network issue');
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white">
      <form onSubmit={HandleOtp} className="space-y-4 bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md">
        <div className="text-2xl font-semibold">🔐 OTP Generator</div>
        <div className="text-xl">
          Generated OTP: <span className="font-mono">{otp || '---'}</span>
        </div>

        {errorMsg && (
          <div className="text-red-600 font-medium text-lg">{errorMsg}</div>
        )}

        <button
          className="border border-black px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
          type="submit"
        >
          Generate OTP
        </button>
      </form>
    </div>
  );
};

export default Otp;