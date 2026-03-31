import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 250;
const NODE_HEIGHT = 120;

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'LR',
): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 150 });

  for (const node of nodes) {
    const w = node.type === 'tool' ? NODE_WIDTH : 200;
    const h = node.type === 'tool' ? NODE_HEIGHT : 80;
    g.setNode(node.id, { width: w, height: h });
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target);
  }

  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const dagreNode = g.node(node.id);
    const w = node.type === 'tool' ? NODE_WIDTH : 200;
    const h = node.type === 'tool' ? NODE_HEIGHT : 80;
    return {
      ...node,
      position: {
        x: dagreNode.x - w / 2,
        y: dagreNode.y - h / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
