import React, { useState } from 'react';
import { Box, List, ListItem, Typography, Paper } from '@mui/material';
import { Graph, Edge } from '../config/variants';

interface EdgeListProps {
  graph: Graph;
}

const EdgeList: React.FC<EdgeListProps> = ({ graph }) => {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  // Vytvoří unikátní ID pro hranu
  const getEdgeId = (edge: Edge) => `${edge.source}-${edge.target}`;

  // Handler pro hover na položku seznamu
  const onEdgeHover = (edgeId: string) => {
    setHoveredEdge(edgeId);
  };

  return (
    <Paper elevation={2} sx={{ maxHeight: 400, overflow: 'auto', maxWidth: 175, margin: 'auto' }}>
      {graph.edges.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Graf zatím neobsahuje žádné hrany.
        </Typography>
      ) : (
        <List dense sx={{ p: 0 }}>
          {graph.edges.map((edge) => {
            const edgeId = getEdgeId(edge);
            const isHovered = hoveredEdge === edgeId;
            return (
              <ListItem 
                key={edgeId}
                onMouseEnter={() => onEdgeHover(edgeId)}
                onMouseLeave={() => onEdgeHover(null)}
                sx={{
                  p: 1,
                  bgcolor: isHovered ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  transition: 'background-color 0.3s',
                }}
                disableGutters
              >
                <Box sx={{ width: '100%' }}>
                  <Typography
                    component="span" 
                    fontWeight={isHovered ? 'bold' : 'normal'}
                  >
                    {edge.source} - {edge.target}
                  </Typography>
                  {edge.value !== undefined && (
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({edge.value})
                    </Typography>
                  )}
                  {edge.type === 'weak' && (
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="info.main"
                      sx={{ ml: 1 }}
                    >
                      [slabá]
                    </Typography>
                  )}
                </Box>
              </ListItem>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default EdgeList;