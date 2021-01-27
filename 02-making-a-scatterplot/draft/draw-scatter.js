async function drawScatter() {
  // your code goes here
  let dataset = await d3.json("./../../my_weather_data.json");

  // step 1: access data
  const xAccessorF = d => d.dewPoint;
  const xAccessorC = d => (d.dewPoint - 32) * 5 / 9;
  const yAccessor = d => d.humidity;

  // step 2: create chart dimensions
  const width = d3.min([window.innerWidth * .9, window.innerHeight * .9]);
  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };
  dimensions.boundWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // step 3: draw canvas
  const wrapper = d3.select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height);
  const bounds = wrapper.append('g')
    .style('transform', `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

  // step 4: create scales
  const xScale = d3.scaleLinear()
    .domain(d3.extent(dataset, xAccessorC))
    .range([0, dimensions.boundWidth])
    .nice();
  const yScale = d3.scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundHeight, 0]) // always invert the axis for y axis
    .nice();
  // extra: add a color scale
  const colorAccessor = d => d.cloudCover;
  const colorScale = d3.scaleLinear()
    .domain(d3.extent(dataset, colorAccessor))
    .range(['skyblue', 'darkslategrey'])

  // step 5: draw data
  //! a. plot with a loop
  // dataset.forEach(d => {
  //   bounds.append('circle')
  //     .attr('cx', xScale(xAccessor(d)))
  //     .attr('cy', yScale(yAccessor(d)))
  //     .attr('r', 5)
  // })
  //! b. plot with data join (1 dataset)
  const dots = bounds.selectAll('circle')
    .data(dataset)
    .enter()
    .append('circle')
    .attr('cx', d => xScale(xAccessorC(d)))
    .attr('cy', d => yScale(yAccessor(d)))
    .attr('r', 5)
    .attr('fill', d => colorScale(colorAccessor(d)));
  // ! c. plot with data join (2 datasets)
  // function drawDots(dataset) {
  //   const dots = bounds.selectAll('circle')
  //     .data(dataset);
  //   dots
  //     .enter().append('circle') // new dots
  //     .merge(dots) // original dots
  //     // .join(dots)
  //     .attr('cx', d => xScale(xAccessor(d)))
  //     .attr('cy', d => yScale(yAccessor(d)))
  //     .attr('r', 5)
  //     .attr('fill', color);
  // }
  // drawDots(dataset.slice(0, 200), 'darkgrey');
  // setTimeout(() => {
  //   drawDots(dataset, 'cornflowerblue')
  // }, 1000);

  // step 6: draw peripherals
  const xAxisGenerator = d3.axisBottom()
    .scale(xScale);
  const xAxis = bounds.append('g')
    .call(xAxisGenerator)
    .style('transform', `translateY(${dimensions.boundHeight}px)`);
  const xAxisLabel = xAxis.append('text')
    .attr('x', dimensions.boundWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .html('Dew Point (&deg;C)');
  const yAxisGenerator = d3.axisLeft()
    .scale(yScale)
    .ticks(4);
  const yAxis = bounds.append('g')
    .call(yAxisGenerator);
  const yAxisLabel = yAxis.append('text')
    .attr('x', - dimensions.boundHeight / 2)
    .attr('y', - dimensions.margin.left + 10)
    .attr('fill', 'black')
    .style('font-size', '1.4em')
    .text('Relative Humidity')
    .style('transform', 'rotate(-90deg)')
    .style('text-anchor', 'middle')
}
drawScatter()