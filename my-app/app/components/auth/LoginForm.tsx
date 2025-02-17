"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import './styles/login.css';
import { login } from '../../utils/auth';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Use the login utility function
        login(data.token, data.user);
        router.push(data.redirectUrl);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#08040e] font-poppins">
      <div className="flex relative h-[444px] border-2 border-[#7429ec] animate-glow">
        <div className="text-center px-4 py-16">
          <h1 className="text-2xl text-white mb-4">Login</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
            <div className="relative mb-6">
              <input
                type="text"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent border-b border-white text-white pb-2 pt-1 px-0 focus:outline-none placeholder:text-transparent"
              />
              <label
                htmlFor="email"
                className="absolute left-0 top-2 text-white text-sm transition-all duration-300 -translate-y-6 text-xs"
              >
                Email
              </label>
              <i className="fa fa-envelope absolute right-0 top-1/2 -translate-y-1/2 text-white text-xs"></i>
            </div>

            <div className="relative mb-6">
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent border-b border-white text-white pb-2 pt-1 px-0 focus:outline-none placeholder:text-transparent"
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-2 text-white text-sm transition-all duration-300 -translate-y-6 text-xs"
              >
                Password
              </label>
              <i className="fa fa-lock absolute right-0 top-1/2 -translate-y-1/2 text-white text-xs"></i>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#541eab] via-[#26a0da] to-[#541eab] text-white py-3 rounded-full transition-all duration-500 bg-[length:200%_auto] hover:bg-[position:100%] mb-4 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <a href="/signup" className="text-[#6324c9] text-xs hover:text-[#7a32e6] hover:underline transition-all duration-500">
              Don't have an Account?
            </a>
          </form>
        </div>

        <div className="login-move login flex flex-col justify-center relative bg-gradient-to-r from-[rgba(29,11,57,1)] via-[rgba(61,22,122,1)] to-[rgba(97,34,198,1)]">
          <div className="text-right px-8">
            <h1 className="text-white text-3xl mb-2">
              Welcome <br />back!
            </h1>
            <p className="text-white">
              Discover amazing features <br />
              by signing in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}