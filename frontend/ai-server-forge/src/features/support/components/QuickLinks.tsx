import { Github, BookOpen, Globe, ExternalLink } from 'lucide-react';

const links = [
  {
    title: 'GitHub Repository',
    description: 'Source code and issue tracker',
    icon: Github,
    href: 'https://github.com/lonexreb/MCPstudio',
    color: 'text-muted-foreground',
  },
  {
    title: 'MCP Specification',
    description: 'Model Context Protocol docs',
    icon: Globe,
    href: 'https://modelcontextprotocol.io',
    color: 'text-mcp-blue-400',
  },
  {
    title: 'Documentation',
    description: 'MCPStudio user guide',
    icon: BookOpen,
    href: '/docs',
    color: 'text-mcp-purple-400',
  },
];

const QuickLinks = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group relative block"
          >
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-br from-mcp-purple-500 to-mcp-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-[1px]" />
            <div className="relative p-4 rounded-xl bg-card border border-border/50 hover:border-transparent transition-all flex items-start gap-3">
              <link.icon className={`h-5 w-5 ${link.color} shrink-0 mt-0.5`} />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium truncate">{link.title}</p>
                  {link.href.startsWith('http') && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
                </div>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
