/**
 * @file EdgeList.tsx
 * @author Tomáš Barták
 * @description
 * Tato komponenta zobrazuje seznam hran grafu. Umožňuje uživateli interagovat s jednotlivými hranami, což zahrnuje zvýraznění hrany při najetí myší a zobrazení dalších informací o hraně.
 */
import React from 'react';
import { Box, List, ListItem, Typography, Paper } from '@mui/material';
import { Graph, Edge } from '../config/variants';

/**
 * Rozhraní pro vlastnosti seznamu hran
 * @interface EdgeListProps
 * @property {Graph} graph - Graf, který obsahuje seznam hran
 * @property {string | null} hoveredEdgeId - ID aktuálně zvýrazněné hrany
 * @property {Function} onEdgeHover - Funkce pro zpracování události najetí myši na hranu
 */
interface EdgeListProps {
	graph: Graph;
	hoveredEdgeId: string | null;
	onEdgeHover: (edgeId: string | null) => void;
}

/**
 * Komponenta pro zobrazení seznamu hran grafu.
 * @param props Vlastnosti komponenty
 * @returns Render komponenty seznamu hran
 */
const EdgeList: React.FC<EdgeListProps> = ({ graph, hoveredEdgeId, onEdgeHover }) => {
  // Vytvoří unikátní ID pro hranu
  const getEdgeId = (edge: Edge) => `${edge.source}-${edge.target}`;

	/**
	 * Vykreslení komponenty seznamu hran s možností zvýraznění hrany v grafu a naopak.
	 */
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
            const isHovered = hoveredEdgeId === edgeId;
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
                  <Typography // Zobrazení názvu hrany
                    component="span" 
                    fontWeight={isHovered ? 'bold' : 'normal'} // Zvýraznění názvu vybrané hrany v seznamu
                  >
                    {edge.source} - {edge.target}
                  </Typography>
                  {edge.value !== undefined && ( // Zobrazení hodnoty hrany, pokud nějakou již má
                    <Typography 
                      component="span" 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({edge.value})
                    </Typography>
                  )}
                  {edge.type === 'weak' && ( // Zobrazí, že je hrana slabá
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