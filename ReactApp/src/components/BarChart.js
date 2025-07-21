import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const BarChart = ({ title, endpoint }) => {
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

    const width = 400;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };

    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const chart = svg.append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, width - margin.left - margin.right])
      .padding(0.2);

    chart.append('g')
      .attr('transform', `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x));

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([height - margin.top - margin.bottom, 0]);

    chart.append('g').call(d3.axisLeft(y));

    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.label))
      .attr('y', d => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', d => height - margin.top - margin.bottom - y(d.value))
      .attr('fill', '#69b3a2');

    chart.selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .text(d => d.value)
      .attr('x', d => x(d.label) + x.bandwidth() / 2)
      .attr('y', d => y(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px');
  }, [data]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 align="center">{title}</h3>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default BarChart;
