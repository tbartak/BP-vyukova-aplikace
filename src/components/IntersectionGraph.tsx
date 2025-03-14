import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Graph } from '../config/variants'

interface IntersectionGraphProps {
  graph: Graph
}
// TODO: zajistit, aby se hodnoty hran a vrcholů nevypisovali přes čáry
const IntersectionGraph: React.FC<IntersectionGraphProps> = ({ graph }) => {
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
      .attr('stroke-width', 2)
			.attr('stroke-dasharray', d => d.type === 'weak' ? '5,5' : 'none')

		// Vykreslíme hodnoty hran, pokud existují
    svg
      .selectAll('.edge-value')
      .data(graph.edges.filter(e => e.value !== undefined))
      .enter()
      .append('text')
      .attr('class', 'edge-value')
      .attr('x', d => (vertexPositions[d.source][0] + vertexPositions[d.target][0]) / 2)
      .attr('y', d => (vertexPositions[d.source][1] + vertexPositions[d.target][1]) / 2 - 5)
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .text(d => d.value)
      .attr('font-size', '12px')
      .attr('fill', 'black');

    // Vykreslíme vrcholy
    svg
      .selectAll('circle')
      .data(graph.vertices)
      .enter()
      .append('circle')
      .attr('cx', v => vertexPositions[v.id][0])
      .attr('cy', v => vertexPositions[v.id][1])
      .attr('r', 15)
      .attr('fill', v => {
				if (v.color?.startsWith('linear-gradient')) {
					// Vytvoříme gradient pro rozdělené vrcholy
					const gradientId = `gradient-${v.id}`;
					const gradient = svg.append('defs')
						.append('linearGradient')
						.attr('id', gradientId);
						
					gradient.append('stop')
						.attr('offset', '50%')
						.attr('stop-color', 'red');
						
					gradient.append('stop')
						.attr('offset', '50%')
						.attr('stop-color', 'blue');
						
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

		// Přidáme hodnoty vrcholů, pokud existují
		svg
			.selectAll('.vertex-value')
			.data(graph.vertices.filter(v => v.value !== undefined))
			.enter()
			.append('text')
			.attr('class', 'vertex-value')
			.attr('x', v => vertexPositions[v.id][0])
			.attr('y', v => vertexPositions[v.id][1])
			.attr('dy', -20)
			.attr('text-anchor', 'middle')
			.text(v => v.value)
			.attr('font-size', '12px')
			.attr('fill', 'black')

  }, [graph])

  return <svg ref={svgRef} />
}

export default IntersectionGraph