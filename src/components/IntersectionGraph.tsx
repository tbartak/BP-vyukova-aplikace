import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Graph } from '../config/variants'

interface IntersectionGraphProps {
  graph: Graph
}

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
    const angleStep = (2 * Math.PI) / graph.vertices.length
    graph.vertices.forEach((v, i) => {
      const angle = i * angleStep
      const x = width / 2 + radius * Math.cos(angle)
      const y = height / 2 + radius * Math.sin(angle)
      vertexPositions[v] = [x, y]
    })

    svg.attr('width', width).attr('height', height)

    // Vykreslíme hrany
    svg
      .selectAll('line')
      .data(graph.edges)
      .enter()
      .append('line')
      .attr('x1', d => vertexPositions[d[0]][0])
      .attr('y1', d => vertexPositions[d[0]][1])
      .attr('x2', d => vertexPositions[d[1]][0])
      .attr('y2', d => vertexPositions[d[1]][1])
      .attr('stroke', 'black')
      .attr('stroke-width', 2)

    // Vykreslíme vrcholy
    svg
      .selectAll('circle')
      .data(graph.vertices)
      .enter()
      .append('circle')
      .attr('cx', v => vertexPositions[v][0])
      .attr('cy', v => vertexPositions[v][1])
      .attr('r', 15)
      .attr('fill', 'lightblue')
      .attr('stroke', 'black')

    // Přidáme popisky vrcholů
    svg
      .selectAll('text')
      .data(graph.vertices)
      .enter()
      .append('text')
      .attr('x', v => vertexPositions[v][0])
      .attr('y', v => vertexPositions[v][1])
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .text(v => v)
      .attr('font-size', '12px')
      .attr('fill', 'black')
  }, [graph])

  return <svg ref={svgRef} />
}

export default IntersectionGraph