async function drawLineChart() {
  // write your code here
  const dataset = await d3.json('../../my_weather_data.json');
  const yAccessor = d => d.temperatureMax;

  // d3.timeParse takes a string specifying a date format and outputs a function that will parse dates of that format
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = d => dateParser(d.date);

  let dimensions = {
    width: window.innerWidth * .9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // d3.select select from and modify the DOM - accecpts css-selector like strings and returns the first matching DOM element
  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);

  // g to svg is div to html
  // g element will expand to fit its content
  const bounds = wrapper.append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  // convert temp to pixel scale - needs domain(minmax of input) and range(minmax of output) to work
  // d3.extent() grabs range of a given array, taking 1. an array of data points 2.  an accessor function
  const yScale = d3.scaleLinear().domain(d3.extent(dataset, yAccessor)).range([dimensions.boundedHeight, 0]);

  const freezingTemperaturePlacement = yScale(32);
  const freezingTemperatures = bounds.append('rect')
    .attr('x', 0)
    .attr('width', dimensions.boundedWidth)
    .attr('y', freezingTemperaturePlacement)
    .attr('height', dimensions.boundedHeight - freezingTemperaturePlacement)
    .attr('fill', '#e0f3f3');

  const xScale = d3.scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  // convert data point to a d string
  // transform our data point with both the accessor function and the scale to get the scaled value in pixel space
  const lineGenerator = d3.line()
    .x(d => xScale(xAccessor(d)))
    .y(d => yScale(yAccessor(d)))

  const line = bounds.append('path')
    .attr('d', lineGenerator(dataset))
    .attr('fill', 'none')
    .attr('stroke', '#af9358')
    .attr('stroke-width', 2);

  const yAxisGenerator = d3.axisLeft()
    .scale(yScale);
  // const yAxis = bounds.append('g');
  // yAxisGenerator(yAxis);
  // or do to preserve the chained method
  const yAxis = bounds.append('g').call(yAxisGenerator)
  const xAxisGenerator = d3.axisBottom()
    .scale(xScale);
  const xAxis = bounds.append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)

}

drawLineChart()