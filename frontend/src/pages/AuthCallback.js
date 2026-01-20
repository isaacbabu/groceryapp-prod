import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // This page is no longer needed with Google Identity Services
    // Redirect to login page
    navigate('/login', { replace: true });
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900 mx-auto"></div>
        <p className="mt-4 text-zinc-600 font-secondary">Redirecting...</p>
      </div>
    </div>
  );
};

export default AuthCallback;