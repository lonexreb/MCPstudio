import type { TourStep } from '../types/onboarding';

export const tourSteps: TourStep[] = [
  {
    target: '[data-tour="sidebar"]',
    title: 'Navigation',
    content: 'Use the sidebar to navigate between servers, tools, pipelines, and more.',
    placement: 'right',
    route: '/',
  },
  {
    target: '[data-tour="new-server"]',
    title: 'Create a Server',
    content: 'Click here to add a new MCP server. Enter the connection URL and authentication details.',
    placement: 'right',
    route: '/',
  },
  {
    target: '[data-tour="dashboard-hero"]',
    title: 'Dashboard',
    content: 'Your command center. View connected servers, quick stats, and manage everything from here.',
    placement: 'bottom',
    route: '/',
  },
  {
    target: '[data-tour="tools-hero"]',
    title: 'Tools Library',
    content: 'Browse all tools across your connected servers. Search, filter, and jump to any tool.',
    placement: 'bottom',
    route: '/tools',
  },
  {
    target: '[data-tour="pipelines-hero"]',
    title: 'Visual Pipelines',
    content: 'Chain tools together in a visual DAG. Drag, connect, and run multi-step workflows.',
    placement: 'bottom',
    route: '/pipelines',
  },
  {
    target: '[data-tour="arena-hero"]',
    title: 'Execution Arena',
    content: 'Compare tool executions side-by-side. Great for benchmarking and debugging.',
    placement: 'bottom',
    route: '/arena',
  },
];
