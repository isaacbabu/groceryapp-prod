import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { 
          theme: 'outline', 
          size: 'large',
          width: '300',
          text: 'signin_with'
        }
      );
    };

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const res = await fetch(`${backendUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential: response.credential }),
      });

      if (!res.ok) {
        throw new Error('Authentication failed');
      }

      const data = await res.json();
      
      // Store session token in localStorage as backup
      if (data.session_token) {
        localStorage.setItem('session_token', data.session_token);
      }

      // Navigate to home page
      navigate('/', { state: { user: data.user }, replace: true });
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-50">
      <div className="text-center space-y-8 max-w-md px-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold font-primary text-emerald-950 tracking-tight mb-2">
            Emmanuel Supermarket
          </h1>
          <p className="text-xl text-emerald-800 font-secondary font-medium mb-3">
            Online Grocery Shopping
          </p>
          <p className="text-zinc-600 font-secondary text-base italic">
            &ldquo;The products you need, at prices you&apos;ll love, delivered with care.&rdquo;
          </p>
        </div>
        
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-emerald-900" />
            </div>
            <h2 className="text-xl font-primary font-bold text-emerald-950 mb-2">
              Sign in to continue
            </h2>
            <p className="text-sm text-zinc-500 font-secondary">
              Use your Google account to access the billing system
            </p>
          </div>
          
          {/* Google Sign-In Button will be rendered here */}
          <div id="google-signin-btn" className="flex justify-center"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;