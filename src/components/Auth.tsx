import React from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, LogOut } from 'lucide-react';

interface AuthProps {
  user: any;
  translations: {
    loginWithGoogle: string;
    loginWithGithub: string;
    logout: string;
  };
}

export function Auth({ user, translations }: AuthProps) {
  const handleLogin = async (provider: 'google' | 'github') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      if (error) {
        console.error('Auth error:', error.message);
        alert(`Login error: ${error.message}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
        alert(`Logout error: ${error.message}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An error occurred during logout. Please try again.');
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {translations.logout}
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleLogin('google')}
        className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors"
      >
        <LogIn className="w-4 h-4" />
        {translations.loginWithGoogle}
      </button>
      <button
        onClick={() => handleLogin('github')}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 rounded-md transition-colors"
      >
        <LogIn className="w-4 h-4" />
        {translations.loginWithGithub}
      </button>
    </div>
  );
}