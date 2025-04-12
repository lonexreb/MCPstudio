
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form';

interface AuthenticationConfig {
  type: 'none' | 'apiKey' | 'oauth' | 'jwt';
  config: Record<string, any>;
}

interface AuthConfigProps {
  authentication: AuthenticationConfig;
  onChange: (authentication: AuthenticationConfig) => void;
}

const AuthConfig = ({ authentication, onChange }: AuthConfigProps) => {
  const handleTypeChange = (type: 'none' | 'apiKey' | 'oauth' | 'jwt') => {
    let config = {};
    
    // Initialize default config based on type
    if (type === 'apiKey') {
      config = { header: 'X-API-Key' };
    } else if (type === 'oauth') {
      config = { provider: 'generic', clientId: '', clientSecret: '' };
    } else if (type === 'jwt') {
      config = { secret: '', expiresIn: '1d' };
    }
    
    onChange({ type, config });
  };
  
  const handleConfigChange = (key: string, value: any) => {
    onChange({
      ...authentication,
      config: {
        ...authentication.config,
        [key]: value
      }
    });
  };
  
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Configure how clients authenticate with your MCP server. Choose the appropriate authentication method based on your security requirements.
      </p>
      
      <RadioGroup 
        value={authentication.type} 
        onValueChange={handleTypeChange as any}
      >
        <div className="flex items-start space-x-2 mb-4">
          <RadioGroupItem value="none" id="auth-none" className="mt-1" />
          <div className="grid gap-1.5">
            <Label htmlFor="auth-none" className="font-medium">No Authentication</Label>
            <p className="text-sm text-muted-foreground">
              Open access with no authentication required. Only suitable for public or development servers.
            </p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2 mb-4">
          <RadioGroupItem value="apiKey" id="auth-apikey" className="mt-1" />
          <div className="grid gap-1.5 w-full">
            <Label htmlFor="auth-apikey" className="font-medium">API Key</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Simple key-based authentication. Keys are included in request headers.
            </p>
            
            {authentication.type === 'apiKey' && (
              <div className="mt-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="header-name">Header Name</Label>
                  <Input
                    id="header-name"
                    value={authentication.config.header || 'X-API-Key'}
                    onChange={(e) => handleConfigChange('header', e.target.value)}
                    placeholder="X-API-Key"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <RadioGroupItem value="jwt" id="auth-jwt" className="mt-1" />
          <div className="grid gap-1.5 w-full">
            <Label htmlFor="auth-jwt" className="font-medium">JWT (JSON Web Tokens)</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Token-based authentication with support for expiration and claims.
            </p>
            
            {authentication.type === 'jwt' && (
              <div className="mt-2 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jwt-secret">Secret Key</Label>
                  <Input
                    id="jwt-secret"
                    value={authentication.config.secret || ''}
                    onChange={(e) => handleConfigChange('secret', e.target.value)}
                    placeholder="Your secret key"
                    type="password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jwt-expires">Expires In</Label>
                  <Input
                    id="jwt-expires"
                    value={authentication.config.expiresIn || '1d'}
                    onChange={(e) => handleConfigChange('expiresIn', e.target.value)}
                    placeholder="1d"
                  />
                  <p className="text-xs text-muted-foreground">
                    Examples: 60 (60 seconds), 2h (2 hours), 1d (1 day)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};

export default AuthConfig;
