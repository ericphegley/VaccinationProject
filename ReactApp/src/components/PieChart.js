import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const PieChart = ({ title, endpoint }) => {
  const svgRef = useRef();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(endpoint);
        const formatted = Object.entries(res.data).map(([label, value]) => ({ label, value }));
        setData(formatted);
      } catch (err) {
        console.error(`Failed to fetch data for ${title}:`, err);
      }
    };

    fetchData();
  }, [endpoint, title]);

  useEffect(() => {
    if (data.length === 0) return;

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

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
      .style('font-size', '16px')
      .style('font-family', 'Arial')
      .style('font-weight', 'bold')
      .style('fill', 'white')
  }, [data]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 align="center">{title}</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default PieChart;
