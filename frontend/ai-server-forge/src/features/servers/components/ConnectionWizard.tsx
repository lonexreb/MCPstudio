import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  Link,
  Shield,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { TerminalAnimation, type TerminalLine } from '@/components/ui/terminal-animation';
import { useCreateServer, useConnectServer } from '@/features/servers/hooks/use-servers';

const STEPS = [
  { id: 'info', label: 'Server Info', icon: Server },
  { id: 'connection', label: 'Connection', icon: Link },
  { id: 'auth', label: 'Authentication', icon: Shield },
  { id: 'discover', label: 'Discover', icon: Search },
  { id: 'confirm', label: 'Confirm', icon: CheckCircle2 },
] as const;

type StepId = (typeof STEPS)[number]['id'];

interface WizardState {
  name: string;
  description: string;
  connectionUrl: string;
  authType: 'none' | 'apiKey' | 'oauth' | 'jwt';
  authConfig: Record<string, string>;
}

const ConnectionWizard = () => {
  const navigate = useNavigate();
  const createServer = useCreateServer();
  const connectServer = useConnectServer();

  const [currentStep, setCurrentStep] = useState<StepId>('info');
  const [state, setState] = useState<WizardState>({
    name: '',
    description: '',
    connectionUrl: '',
    authType: 'none',
    authConfig: {},
  });
  const [createdServerId, setCreatedServerId] = useState<string | null>(null);
  const [discoveredTools, setDiscoveredTools] = useState<Array<{ id: string; name: string; description: string }>>([]);
  const [discoveryDone, setDiscoveryDone] = useState(false);
  const [discoveryLines, setDiscoveryLines] = useState<TerminalLine[]>([]);

  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 'info':
        return state.name.trim().length > 0;
      case 'connection':
        return state.connectionUrl.trim().length > 0;
      case 'auth':
        return true;
      case 'discover':
        return discoveryDone;
      case 'confirm':
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= STEPS.length) return;

    const nextStep = STEPS[nextIndex].id;

    if (nextStep === 'discover') {
      setCurrentStep(nextStep);
      await handleCreateAndDiscover();
    } else if (nextStep === 'confirm' && !createdServerId) {
      return;
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (currentIndex === 0) {
      navigate('/');
      return;
    }
    const prevStep = STEPS[currentIndex - 1].id;
    if (currentStep === 'discover' || currentStep === 'confirm') {
      setCurrentStep(STEPS[currentIndex - 1].id);
      return;
    }
    setCurrentStep(prevStep);
  };

  const handleCreateAndDiscover = async () => {
    setDiscoveryDone(false);
    setDiscoveryLines([
      { text: `Creating server "${state.name}"...`, type: 'command' },
    ]);

    try {
      const authConfig = state.authType !== 'none'
        ? { type: state.authType, credentials: state.authConfig }
        : undefined;

      const server = await createServer.mutateAsync({
        name: state.name,
        description: state.description,
        connection_url: state.connectionUrl,
        auth_config: authConfig,
      });

      setCreatedServerId(server.id);
      setDiscoveryLines((prev) => [
        ...prev,
        { text: `Server created with ID: ${server.id}`, type: 'success' },
        { text: `Connecting to ${state.connectionUrl}...`, type: 'command' },
      ]);

      try {
        const connected = await connectServer.mutateAsync(server.id);
        const tools = connected.tools || [];
        setDiscoveredTools(tools);
        setDiscoveryLines((prev) => [
          ...prev,
          { text: `Connected successfully`, type: 'success' },
          { text: `Discovered ${tools.length} tool(s)`, type: 'success' },
          ...tools.map((t) => ({
            text: `  - ${t.name}: ${t.description}`,
            type: 'info' as const,
          })),
          { text: 'Discovery complete', type: 'success' },
        ]);
      } catch {
        setDiscoveryLines((prev) => [
          ...prev,
          { text: 'Connection failed - server created but not connected', type: 'warning' },
          { text: 'You can connect later from the server detail page', type: 'info' },
        ]);
      }
    } catch (err: any) {
      setDiscoveryLines((prev) => [
        ...prev,
        { text: `Failed to create server: ${err.message}`, type: 'error' },
      ]);
    }

    setDiscoveryDone(true);
  };

  const handleFinish = () => {
    if (createdServerId) {
      toast.success('MCP server created successfully');
      navigate(`/server/${createdServerId}`);
    }
  };

  const update = (field: keyof WizardState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const updateAuthConfig = (key: string, value: string) => {
    setState((prev) => ({
      ...prev,
      authConfig: { ...prev.authConfig, [key]: value },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === currentIndex;
          const isDone = i < currentIndex;
          return (
            <React.Fragment key={step.id}>
              {i > 0 && (
                <div
                  className={`flex-1 h-0.5 ${isDone ? 'bg-primary' : 'bg-muted'}`}
                />
              )}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isDone
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <Card className="border-2 shadow-sm">
        {/* Step 1: Server Info */}
        {currentStep === 'info' && (
          <>
            <CardHeader>
              <CardTitle>Server Information</CardTitle>
              <CardDescription>
                Give your MCP server a name and description
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Server Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Document Search Engine"
                  value={state.name}
                  onChange={(e) => update('name', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="What does this MCP server do?"
                  value={state.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Connection */}
        {currentStep === 'connection' && (
          <>
            <CardHeader>
              <CardTitle>Connection URL</CardTitle>
              <CardDescription>
                Specify how to connect to this MCP server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Connection URL *</Label>
                <Input
                  id="url"
                  placeholder="e.g., googledrive://default, https://my-mcp-server.com"
                  value={state.connectionUrl}
                  onChange={(e) => update('connectionUrl', e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  The URL or protocol scheme used to connect to this MCP server
                </p>
              </div>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">Supported protocols:</p>
                <div className="flex flex-wrap gap-2">
                  {['googledrive://', 'https://', 'http://', 'stdio://', 'ws://'].map((p) => (
                    <Badge key={p} variant="outline" className="font-mono text-xs">
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Authentication */}
        {currentStep === 'auth' && (
          <>
            <CardHeader>
              <CardTitle>Authentication</CardTitle>
              <CardDescription>
                Configure how to authenticate with the MCP server
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={state.authType}
                onValueChange={(v) => {
                  update('authType', v);
                  update('authConfig', {});
                }}
              >
                <div className="flex items-start space-x-2 mb-4">
                  <RadioGroupItem value="none" id="auth-none" className="mt-1" />
                  <div>
                    <Label htmlFor="auth-none" className="font-medium">No Authentication</Label>
                    <p className="text-sm text-muted-foreground">Open access, suitable for local or development servers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 mb-4">
                  <RadioGroupItem value="apiKey" id="auth-apikey" className="mt-1" />
                  <div className="w-full">
                    <Label htmlFor="auth-apikey" className="font-medium">API Key</Label>
                    <p className="text-sm text-muted-foreground mb-2">Key-based authentication via headers</p>
                    {state.authType === 'apiKey' && (
                      <div className="space-y-2 mt-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input
                          id="api-key"
                          type="password"
                          placeholder="Enter your API key"
                          value={state.authConfig.apiKey || ''}
                          onChange={(e) => updateAuthConfig('apiKey', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="oauth" id="auth-oauth" className="mt-1" />
                  <div>
                    <Label htmlFor="auth-oauth" className="font-medium">OAuth 2.0</Label>
                    <p className="text-sm text-muted-foreground">Token-based auth (configured after creation via Google OAuth flow)</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </>
        )}

        {/* Step 4: Discover */}
        {currentStep === 'discover' && (
          <>
            <CardHeader>
              <CardTitle>Discovering Tools</CardTitle>
              <CardDescription>
                Creating your server and discovering available tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TerminalAnimation
                lines={discoveryLines}
                speed={150}
                title={`${state.name} - Discovery`}
              />
              {discoveryDone && discoveredTools.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Discovered {discoveredTools.length} tool(s):</p>
                  <div className="space-y-1">
                    {discoveredTools.map((tool) => (
                      <div key={tool.id} className="flex items-center gap-2 text-sm p-2 rounded bg-muted/50">
                        <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="font-medium">{tool.name}</span>
                        <span className="text-muted-foreground truncate">{tool.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </>
        )}

        {/* Step 5: Confirm */}
        {currentStep === 'confirm' && (
          <>
            <CardHeader>
              <CardTitle>Review & Confirm</CardTitle>
              <CardDescription>
                Review your server configuration before finishing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-medium">{state.name}</span>
                </div>
                {state.description && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Description</span>
                    <span className="text-sm font-medium max-w-[60%] text-right">{state.description}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Connection</span>
                  <span className="text-sm font-mono">{state.connectionUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Auth</span>
                  <span className="text-sm capitalize">{state.authType === 'none' ? 'None' : state.authType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tools discovered</span>
                  <Badge variant="outline">{discoveredTools.length}</Badge>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Footer with navigation */}
        <CardFooter className="flex justify-between border-t p-6 bg-muted/30">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentIndex === 0 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep === 'confirm' ? (
            <Button onClick={handleFinish} disabled={!createdServerId}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Go to Server
            </Button>
          ) : currentStep === 'discover' ? (
            <Button onClick={handleNext} disabled={!discoveryDone}>
              {!discoveryDone ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Discovering...
                </>
              ) : (
                <>
                  Review
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canGoNext()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ConnectionWizard;
