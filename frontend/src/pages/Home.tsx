import { useState, useEffect, ChangeEvent } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedUsername = document.cookie
      .split('; ')
      .find(row => row.startsWith('username='));

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername.split('=')[1]);
      window.location.href = '/home';
    }
  }, []);

  const handleSubmit = async () => {
    setErrorMessage(''); 
    try {
      const response = await fetch('https://diary-tvtf.onrender.com/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        document.cookie = `username=${username}; path=/; max-age=${7 * 24 * 60 * 60}`;
        localStorage.setItem('authToken', data.token);
        setIsLoggedIn(true);
        window.location.href = '/home';
      } else {
        setErrorMessage(data.message || 'wrong username or password. this account may already exist');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  const handleLogout = () => {
    document.cookie = "username=; path=/; max-age=0";
    localStorage.removeItem('authToken'); 
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
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
      <div className="w-64 text-center">
        <p className="text-sm text-gray-400 mb-5">my journal</p>
        {errorMessage && (
            <p className="text-xs mb-3" style={{ color: '#d68d8d' }}>{errorMessage}</p>
        )}
        <input
          type="text"
          value={username}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          placeholder="username"
          className="w-full text-xs px-3 py-2 border border-gray-100 rounded focus:outline-none focus:border-gray-200 text-gray-600 mb-3"
          autoFocus
        />
        <input
          type="password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
          placeholder="password"
          className="w-full text-xs px-3 py-2 border border-gray-100 rounded focus:outline-none focus:border-gray-200 text-gray-600 mb-3"
        />
        <p
          onClick={handleSubmit}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
        >
          login or register
        </p>
      </div>
    </div>
  );
};

export default Login;
