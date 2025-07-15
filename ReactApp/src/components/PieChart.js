// src/components/BasicPieChart.js
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PieChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    const data = [
      { label: 'Apples', value: 30 },
      { label: 'Bananas', value: 20 },
      { label: 'Cherries', value: 15 },
      { label: 'Dates', value: 35 },
    ];

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    // Clear any old chart before rendering
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map(d => d.label))
      .range(d3.schemeCategory10);

    const pie = d3.pie().value(d => d.value);
    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '2px');

    arcs
      .append('text')
      .text(d => d.data.label)
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '12px');
  }, []);

  return (
    <div>
      <h3>Basic Pie Chart</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;
