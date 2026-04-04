import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is MCPStudio?',
    a: 'MCPStudio is a web platform for creating, testing, managing, and discovering Model Context Protocol (MCP) servers. Think of it as "The Postman for MCP."',
  },
  {
    q: 'How do I connect to an MCP server?',
    a: 'Click "New MCP Server" on the Dashboard, enter the connection URL (e.g., googledrive://default), configure any required authentication, then click Connect.',
  },
  {
    q: 'What are Pipelines?',
    a: 'Pipelines let you chain multiple MCP tools together visually. Drag tools onto the canvas, connect them, and run the entire chain in order.',
  },
  {
    q: 'What is the Arena?',
    a: 'The Arena provides side-by-side comparison of tool executions. You can run the same tool with different parameters, or compare tools across different servers.',
  },
  {
    q: 'Where is my data stored?',
    a: 'Execution history, pipelines, and prompt templates are stored locally in your browser using IndexedDB. Server configurations are stored on the backend (MongoDB or in-memory fallback).',
  },
  {
    q: 'Can I export my server configurations?',
    a: 'Yes! Navigate to a server\'s detail page, go to the Config tab, and use the Export button. You can export as JSON or YAML. Credentials are automatically redacted.',
  },
];

const FaqSection = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Frequently Asked Questions</h3>
      <Accordion type="multiple" className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border border-border/50 rounded-lg px-4 bg-card"
          >
            <AccordionTrigger className="text-sm font-medium hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">{faq.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqSection;
