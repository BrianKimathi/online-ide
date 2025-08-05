import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = () => {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState(null);

  const handleRegister = async (e, email, password, username) => {
    e.preventDefault();
    setFormError(null);
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err) {
      setFormError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-xs">
        <AuthForm mode="register" onRegister={handleRegister} disabled={loading} />
        {loading && <LoadingSpinner className="mt-4" />}
        {(formError || error) && <div className="mt-4 text-red-600 text-center text-sm">{formError || error}</div>}
      </div>
    </div>
  );
};

export default Register; 