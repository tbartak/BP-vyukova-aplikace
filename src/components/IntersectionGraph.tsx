import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Graph } from '../config/variants'

interface IntersectionGraphProps {
  graph: Graph;
	hoveredEdgeId?: string | null;
	onEdgeHover?: (edgeId: string | null) => void;
}

const IntersectionGraph: React.FC<IntersectionGraphProps> = ({ graph, hoveredEdgeId = null, onEdgeHover = () => {} }) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  
  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove() // vyčistíme předchozí vykreslení

    const width = 400
    const height = 400
    const margin = 40
    const radius = Math.min(width, height) / 2 - margin

    // Vypočteme pozice vrcholů ve kruhové geometrii
    const vertexPositions: Record<string, [number, number]> = {}

    // Pokud nejsou žádné vrcholy, nevykreslujeme
    if (graph.vertices.length === 0) {
    	return
    }

    const angleStep = (2 * Math.PI) / graph.vertices.length
    graph.vertices.forEach((v, i) => {
      const angle = i * angleStep
      const x = width / 2 + radius * Math.cos(angle)
      const y = height / 2 + radius * Math.sin(angle)
      vertexPositions[v.id] = [x, y]
    })

    svg.attr('width', width).attr('height', height)

		// Unikátní ID pro hranu
    const getEdgeId = (d) => `${d.source}-${d.target}`;

    // Vykreslíme hrany
    svg
      .selectAll('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('x1', d => vertexPositions[d.source][0])
      .attr('y1', d => vertexPositions[d.source][1])
      .attr('x2', d => vertexPositions[d.target][0])
      .attr('y2', d => vertexPositions[d.target][1])
      .attr('stroke', d => d.color || 'black')
      .attr('stroke-width', d => getEdgeId(d) === hoveredEdgeId ? 4 : 2)
      .attr('stroke-opacity', d => getEdgeId(d) === hoveredEdgeId ? 1 : 0.8)
			.attr('stroke-dasharray', d => d.type === 'weak' ? '5,5' : 'none')
			.attr('data-edge-id', getEdgeId) // Data atribut pro snadné selektování
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        onEdgeHover(getEdgeId(d));
      })
      .on('mouseleave', () => {
        onEdgeHover(null);
      });

		// // Vytvoříme nejprve skupinu pro pozadí textů (budou pod hranami) // TODO: teoreticky se zamyslet nad něčím jiným pro hrany, ale prozatím funkční, případně je možné asi úplně odstranit kvůli seznamu hran se zvýrazněním
    // const labelBackgroundGroup = svg.append('g').attr('class', 'label-backgrounds');
    
    // // Pak skupinu pro hrany (ty už jsou vykreslené)
    // // A nakonec skupinu pro texty (budou nad hranami)
    // const labelGroup = svg.append('g').attr('class', 'labels');

    // // Funkce pro výpočet pozice popisku hrany
    // const calculateEdgeLabelPosition = (d) => {
    //   const x1 = vertexPositions[d.source][0];
    //   const y1 = vertexPositions[d.source][1];
    //   const x2 = vertexPositions[d.target][0];
    //   const y2 = vertexPositions[d.target][1];
      
    //   // Středový bod hrany
    //   const midX = (x1 + x2) / 2;
    //   const midY = (y1 + y2) / 2;
      
    //   // Vektor kolmý k hraně
    //   const dx = x2 - x1;
    //   const dy = y2 - y1;
    //   const length = Math.sqrt(dx * dx + dy * dy);
      
    //   // Normalizovaný kolmý vektor
    //   const offsetSize = 15; // Velikost offsetu
    //   const offsetX = -dy / length * offsetSize;
    //   const offsetY = dx / length * offsetSize;
      
    //   // Přidáme offset ke středovému bodu
    //   return {
    //     x: midX + offsetX,
    //     y: midY + offsetY
    //   };
    // };

    // // Vykreslíme bílé obdélníky jako pozadí pro popisky hran
    // labelBackgroundGroup
    //   .selectAll('.edge-label-bg')
    //   .data(graph.edges.filter(e => e.value !== undefined))
    //   .enter()
    //   .append('rect')
    //   .attr('class', 'edge-label-bg')
    //   .attr('x', d => {
    //     const pos = calculateEdgeLabelPosition(d);
    //     return pos.x - 15; // Offset pro obdélník
    //   })
    //   .attr('y', d => {
    //     const pos = calculateEdgeLabelPosition(d);
    //     return pos.y - 10; // Offset pro obdélník
    //   })
    //   .attr('width', 30)
    //   .attr('height', 20)
    //   .attr('fill', 'white')
    //   .attr('rx', 5) // Zaoblené rohy
    //   .attr('ry', 5);

    // // Vykreslíme hodnoty hran, pokud existují
    // labelGroup
    //   .selectAll('.edge-value')
    //   .data(graph.edges.filter(e => e.value !== undefined))
    //   .enter()
    //   .append('text')
    //   .attr('class', 'edge-value')
    //   .attr('x', d => {
    //     const pos = calculateEdgeLabelPosition(d);
    //     return pos.x;
    //   })
    //   .attr('y', d => {
    //     const pos = calculateEdgeLabelPosition(d);
    //     return pos.y;
    //   })
    //   .attr('text-anchor', 'middle')
    //   .attr('dominant-baseline', 'central') // Centruje vertikálně
    //   .text(d => d.value)
    //   .attr('font-size', '12px')
    //   .attr('fill', 'black');

    // Vykreslíme vrcholy
    svg
      .selectAll('circle')
      .data(graph.vertices)
      .enter()
      .append('circle')
      .attr('cx', v => vertexPositions[v.id][0])
      .attr('cy', v => vertexPositions[v.id][1])
      .attr('r', 15)
      // .attr('fill', v => {
			// 	if (v.color?.startsWith('linear-gradient')) {
			// 		// Extrahovat barvy z řetězce gradientu
			// 		const colorRegex = /linear-gradient\(\d+deg,\s*([\w]+)\s*(\d+)%,\s*([\w]+)\s*(\d+)%(,\s*([\w]+)\s*(\d+)%)?\)/;
			// 		const matches = v.color.match(colorRegex);
					
			// 		const gradientId = `gradient-${v.id}`;
			// 		const gradient = svg.append('defs')
			// 			.append('linearGradient')
			// 			.attr('id', gradientId);
					
			// 		if (matches) {
			// 			// První barva a pozice
			// 			const color1 = matches[1] || 'red';
			// 			const pos1 = matches[2] || '33';
						
			// 			// Druhá barva a pozice  
			// 			const color2 = matches[3] || 'cyan';
			// 			const pos2 = matches[4] || '66';
						
			// 			// Třetí barva a pozice (pokud existuje)
			// 			const color3 = matches[6] || null;
			// 			const pos3 = matches[7] || '100';
						
			// 			// Vytvoříme gradient se dvěma nebo třemi barvami
			// 			gradient.append('stop')
			// 				.attr('offset', '0%')
			// 				.attr('stop-color', color1);
						
			// 			gradient.append('stop')
			// 				.attr('offset', `${pos1}%`)
			// 				.attr('stop-color', color1);
						
			// 			gradient.append('stop')
			// 				.attr('offset', `${pos1}%`)
			// 				.attr('stop-color', color2);
						
			// 			if (color3) {
			// 				gradient.append('stop')
			// 					.attr('offset', `${pos2}%`)
			// 					.attr('stop-color', color2);
							
			// 				gradient.append('stop')
			// 					.attr('offset', `${pos2}%`)
			// 					.attr('stop-color', color3);
							
			// 				gradient.append('stop')
			// 					.attr('offset', '100%')
			// 					.attr('stop-color', color3);
			// 			} else {
			// 				gradient.append('stop')
			// 					.attr('offset', '100%')
			// 					.attr('stop-color', color2);
			// 			}
			// 		} else {
			// 			// Fallback pro případ, že by regex nefungoval
			// 			gradient.append('stop')
			// 				.attr('offset', '0%')
			// 				.attr('stop-color', 'red');
							
			// 			gradient.append('stop')
			// 				.attr('offset', '50%')
			// 				.attr('stop-color', 'cyan');
			// 		}
					
			// 		return `url(#${gradientId})`;
			// 	} else {
			// 		return v.color || 'lightblue';
			// 	}
			// })
			.attr('fill', v => {
				if (typeof v.color === 'object' && v.color?.type === 'gradient') {
					const gradientId = `gradient-${v.id}`;
					const gradient = svg.append('defs')
						.append('linearGradient')
						.attr('id', gradientId);
					
					const colors = v.color.colors || ['red', 'cyan'];
					const sliceSize = 100 / colors.length;
					
					colors.forEach((color, index) => {
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
					return v.color || 'lightblue';
				}
			})
      .attr('stroke', 'black')

    // Přidáme popisky vrcholů
    svg
      .selectAll('.vertex-label')
      .data(graph.vertices)
      .enter()
      .append('text')
			.attr('class', 'vertex-label')
      .attr('x', v => vertexPositions[v.id][0])
      .attr('y', v => vertexPositions[v.id][1])
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text(v => v.id)
      .attr('font-size', '12px')
      .attr('fill', 'black')

		// Přidáme hodnoty vrcholům, pokud existují
		svg
			.selectAll('.vertex-value')
			.data(graph.vertices.filter(v => v.value !== undefined))
			.enter()
			.append('text')
			.attr('class', 'vertex-value')
			.attr('x', v => vertexPositions[v.id][0])
			.attr('y', v => {
				const centerY = height / 2; // střed grafu
				const vertexY = vertexPositions[v.id][1];
				return vertexY > centerY ? vertexY + 30 : vertexY - 20; // hodnota pod vrcholem, pokud je ve spodní polovině grafu, jinak nad ním
			})
			.attr('text-anchor', 'middle')
			.text(v => v.value)
			.attr('font-size', '12px')
			.attr('fill', 'black')

  }, [graph, hoveredEdgeId, onEdgeHover])

  return <svg ref={svgRef} />
}

export default IntersectionGraph