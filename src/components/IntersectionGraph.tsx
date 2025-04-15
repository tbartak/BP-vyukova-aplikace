/**
 * @file IntersectionGraph.tsx
 * @author Tomáš Barták
 * @description
 * Tato komponenta slouží k vizualizaci grafu a s ním souvisejících popisků hran a vrcholů a také propojení se seznamem hran pomocí zvýrazňování hran.
 */
import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Graph, Edge, Vertex } from '../config/variants'

/**
 * Rozhraní pro vizualizaci grafu
 * @interface IntersectionGraphProps
 * @property {Graph} graph - Graf, který se má vykreslit
 * @property {string | null} hoveredEdgeId - ID aktuálně zvýrazněné hrany
 * @property {Function} onEdgeHover - Funkce volaná při najetí myši na hranu
 */
interface IntersectionGraphProps {
  graph: Graph;
	hoveredEdgeId?: string | null;
	onEdgeHover?: (edgeId: string | null) => void;
}

/**
 * Komponenta pro vykreslení grafu.
 * @param props Vlastnosti komponenty
 * @returns Render komponenty vizualizace grafu
 */
const IntersectionGraph: React.FC<IntersectionGraphProps> = ({ graph, hoveredEdgeId = null, onEdgeHover = () => {} }) => {
	/**
	 * Do svgRef se vykreslují SVG elementy, které tvoří graf.
	 */
  const svgRef = useRef<SVGSVGElement | null>(null)
  
	/**
	 * Vykreslení grafu
	 */
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // vyčištění předchozího vykreslení

		// Nastavení velikosti SVG
    const width = 400
    const height = 400
    const margin = 40
    const radius = Math.min(width, height) / 2 - margin

    // Vypočtení pozice vrcholů ve tvaru kruhu
    const vertexPositions: Record<string, [number, number]> = {}

    // Pokud nejsou žádné vrcholy, nevykresluje se nic
    if (graph.vertices.length === 0) {
    	return
    }

    const angleStep = (2 * Math.PI) / graph.vertices.length // Úhel mezi vrcholy
    graph.vertices.forEach((vertex, i) => {
      const angle = i * angleStep
      const x = width / 2 + radius * Math.cos(angle) // Pozice na ose x
      const y = height / 2 + radius * Math.sin(angle) // Pozice na ose y
      vertexPositions[vertex.id] = [x, y]
    })

    svg.attr('width', width).attr('height', height)

		// Unikátní ID pro hranu
    const getEdgeId = (edge: Edge) => `${edge.source}-${edge.target}`;

		/**
		 * Pomocná funkce pro určení barevné výplně vrcholu.
		 * @param vertex Vrchol, který se má obarvit
		 * @param svg SVG element, do kterého se vykresluje
		 * @returns Výplň vrcholu
		 */
		const getVertexFill = (vertex: Vertex, svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>): string => {
			if (typeof vertex.color === 'object' && vertex.color?.type === 'fractional') { // Pokud se jedná o frakcionální barvení
				const gradientId = `gradient-${vertex.id}`;
				const gradient = svg.append('defs')
					.append('linearGradient')
					.attr('id', gradientId);
				
				const colors = vertex.color.colors || ['red', 'cyan'];
				const sliceSize = 100 / colors.length; // Procentuální velikost každého úseku
				
				// Přidání frakcionálního barvení postupně pro každou barvu vrcholu
				colors.forEach((color: string, index: number) => {
					const position = index * sliceSize;
					
					if (index > 0) {
						// Konec předchozí barvy
						gradient.append('stop')
							.attr('offset', `${position}%`)
							.attr('stop-color', colors[index-1]);
					}
					
					// Začátek aktuální barvy
					gradient.append('stop')
						.attr('offset', `${position}%`)
						.attr('stop-color', color);
					
					// Pokud je to poslední barva, pokračuje až do konce
					if (index === colors.length - 1) {
						gradient.append('stop')
							.attr('offset', '100%')
							.attr('stop-color', color);
					}
				});
				
				return `url(#${gradientId})`;
			} else {
				return typeof vertex.color === 'string' ? vertex.color : 'lightblue'; // Pokud se vrchol nemá barvit frakcionálně, pak dostane zvolenou barvu a nebo výchozí světle modrou barvu
			}
		};

    // Vykreslení hrany
    svg
      .selectAll('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('x1', (edge: Edge) => vertexPositions[edge.source][0])
      .attr('y1', (edge: Edge) => vertexPositions[edge.source][1])
      .attr('x2', (edge: Edge) => vertexPositions[edge.target][0])
      .attr('y2', (edge: Edge) => vertexPositions[edge.target][1])
      .attr('stroke', 'black')
      .attr('stroke-width', (edge: Edge) => getEdgeId(edge) === hoveredEdgeId ? 4 : 2) // Zvolená hrana bude tučnější
      .attr('stroke-opacity', (edge: Edge) => getEdgeId(edge) === hoveredEdgeId ? 1 : 0.8) // Zvýraznění zvolené hrany
			.attr('stroke-dasharray', (edge: Edge) => edge.type === 'weak' ? '5,5' : 'none') // Pokud je hrana slabá, tak bude čárkovaně
			.attr('data-edge-id', getEdgeId) // Atribut pro snadné selektování hrany
      .style('cursor', 'pointer')
      .on('mouseenter', (_event: MouseEvent, edge: Edge) => { // Vybrání hrany přejetím kurzoru
        onEdgeHover(getEdgeId(edge));
      })
      .on('mouseleave', () => {
        onEdgeHover(null);
      });

    // Vykreslení vrcholu
    svg
      .selectAll('circle')
      .data(graph.vertices)
      .enter()
      .append('circle')
      .attr('cx', (vertex: Vertex) => vertexPositions[vertex.id][0])
      .attr('cy', (vertex: Vertex) => vertexPositions[vertex.id][1])
      .attr('r', 15)
			.attr('fill', (vertex: Vertex) => getVertexFill(vertex, svg)) // barva vrcholu
      .attr('stroke', 'black')

    // Přidání popisku vrcholu
    svg
      .selectAll('.vertex-label')
      .data(graph.vertices)
      .enter()
      .append('text')
			.attr('class', 'vertex-label')
      .attr('x', (vertex: Vertex) => vertexPositions[vertex.id][0])
      .attr('y', (vertex: Vertex) => vertexPositions[vertex.id][1])
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text((vertex: Vertex) => vertex.id)
      .attr('font-size', '12px')
      .attr('fill', 'black')

		// Přidání hodnoty vrcholu, pokud existuje
		svg
			.selectAll('.vertex-value')
			.data(graph.vertices.filter((vertex: Vertex) => vertex.value !== undefined))
			.enter()
			.append('text')
			.attr('class', 'vertex-value')
			.attr('x', (vertex: Vertex) => vertexPositions[vertex.id][0])
			.attr('y', (vertex: Vertex) => {
				const centerY = height / 2; // Střed grafu
				const vertexY = vertexPositions[vertex.id][1];
				return vertexY > centerY ? vertexY + 30 : vertexY - 20; // Hodnota pod vrcholem, pokud je ve spodní polovině grafu, jinak nad ním
			})
			.attr('text-anchor', 'middle')
			.text((vertex: Vertex) => vertex.value !== undefined ? vertex.value.toString() : '')
			.attr('font-size', '12px')
			.attr('fill', 'black')

  }, [graph, hoveredEdgeId, onEdgeHover])

	/**
	 * Vykreslení komponenty vizualizace grafu
	 */
  return <svg ref={svgRef} />
}

export default IntersectionGraph