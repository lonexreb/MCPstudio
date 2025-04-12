
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const MainLayout = ({ children, title = 'AI Server Forge', subtitle }: MainLayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar activePath={location.pathname} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
