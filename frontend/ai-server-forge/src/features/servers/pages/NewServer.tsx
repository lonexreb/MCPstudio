import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import ConnectionWizard from '@/features/servers/components/ConnectionWizard';

const NewServer = () => {
  const navigate = useNavigate();

  return (
    <MainLayout title="Create New MCP Server">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <ConnectionWizard />
      </div>
    </MainLayout>
  );
};

export default NewServer;
