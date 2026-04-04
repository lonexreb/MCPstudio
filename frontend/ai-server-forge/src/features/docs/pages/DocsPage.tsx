import { BookOpen } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { docSections } from '../lib/docs-content';

const DocsPage = () => {
  return (
    <MainLayout title="Documentation" subtitle="Learn how to use MCPStudio">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl p-6 gradient-brand shadow-lg">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white blur-3xl" />
          </div>
          <div className="relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Documentation</h2>
              <p className="text-white/70 text-sm">
                Everything you need to know about MCPStudio
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <Accordion type="multiple" defaultValue={['getting-started']} className="space-y-2">
          {docSections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border border-border/50 rounded-lg px-4 bg-card"
            >
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent>
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                  {section.content}
                </pre>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default DocsPage;
