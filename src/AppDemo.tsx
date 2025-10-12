import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { AppHeader } from './components/AppHeader';
import { Demo } from './components/Demo';

// Demo user data
const demoUser = {
  id: 'user-123',
  username: 'ChefDemo',
  email: 'chef@demo.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  notificationCount: 3,
};

export default function AppDemo() {
  const handleSignIn = () => {
    console.log('Sign in clicked');
  };

  const handleSignOut = () => {
    console.log('Sign out clicked');
  };

  const handleSearch = (query: string) => {
    console.log('Search query:', query);
  };

  const handleNavigate = (path: string) => {
    console.log('Navigate to:', path);
  };

  return (
    <ThemeProvider>
      <AppHeader
        user={demoUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onSearch={handleSearch}
        onNavigate={handleNavigate}
      />
      <Demo />
    </ThemeProvider>
  );
}
