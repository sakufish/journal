import { useState, useEffect, FormEvent, ChangeEvent } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUsername = document.cookie
      .split('; ')
      .find(row => row.startsWith('username='));

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername.split('=')[1]);
      window.location.href = '/home'
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `username=${username}; path=/; max-age=${7 * 24 * 60 * 60}`;
        setIsLoggedIn(true);
        window.location.href = '/home'
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('An error occurred. Please try again later.');
    }
  };

  const handleLogout = () => {
    document.cookie = "username=; path=/; max-age=0";
    setIsLoggedIn(false);
    setUsername('');
  };

  if (isLoggedIn) {
    return (
      <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">you are {username}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full bg-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-64">
        <input
          type="text"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full text-xs px-3 py-2 border border-gray-100 rounded focus:outline-none focus:border-gray-200 text-gray-600"
          autoFocus
        />
      </form>
    </div>
  );
};

export default Login;
