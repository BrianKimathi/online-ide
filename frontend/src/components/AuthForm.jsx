import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AuthForm = ({ mode, onLogin, onRegister, disabled }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isLogin = mode === 'login';

  const handleSubmit = (e) => {
    if (isLogin && onLogin) {
      onLogin(e, email, password);
    } else if (!isLogin && onRegister) {
      onRegister(e, email, password, username);
    } else {
      e.preventDefault();
    }
  };

  return (
    <form className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded shadow-md w-full max-w-xs sm:max-w-sm flex flex-col gap-4 border border-gray-200 dark:border-gray-700" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2 text-center text-blue-700 dark:text-blue-300">{isLogin ? 'Login' : 'Register'}</h2>
      {!isLogin && (
        <input
          type="text"
          placeholder="Username"
          className="p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          disabled={disabled}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={disabled}
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 rounded border border-gray-400 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        disabled={disabled}
      />
      <button type="submit" className="bg-blue-700 dark:bg-blue-500 text-white py-2 rounded hover:bg-blue-800 dark:hover:bg-blue-600 transition font-semibold" disabled={disabled}>
        {isLogin ? 'Login' : 'Register'}
      </button>
      <div className="text-center text-sm text-gray-700 dark:text-gray-300">
        {isLogin ? (
          <>Don't have an account? <Link to="/register" className="text-blue-700 dark:text-blue-300 hover:underline">Register</Link></>
        ) : (
          <>Already have an account? <Link to="/login" className="text-blue-700 dark:text-blue-300 hover:underline">Login</Link></>
        )}
      </div>
    </form>
  );
};

export default AuthForm; 