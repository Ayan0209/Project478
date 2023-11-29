// Assuming you have SVG images for the maps
const usMapImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/BlankMap-USA-states.PNG/1200px-BlankMap-USA-states.PNG';
const indiaMapImage = 'https://static.vecteezy.com/system/resources/thumbnails/012/806/697/small/doodle-freehand-drawing-of-india-map-free-png.png';

 // Fixed width and height for SVG panels
 const panelWidth = 400; // Adjust as needed
 const panelHeight = 400; // Adjust as needed

// Load the US map
d3.select('#usMap')
  .append('image')
  .attr('xlink:href', usMapImage)
  .attr('width', '100%')
  .attr('height', '100%');

// Load the India map
d3.select('#indiaMap')
  .append('image')
  .attr('xlink:href', indiaMapImage)
  .attr('width', '100%')
  .attr('height', '100%');

// Assuming you have a file named 'GDP.csv' with the specified format
d3.csv('data/GDP.csv').then(function(data) {
  // Extract data for India and US
  const indiaData = data.filter(d => d['Country Name'] === 'India')[0];
  const usData = data.filter(d => d['Country Name'] === 'United States')[0];

  // Extract years and GDP values
  const years = Object.keys(indiaData).slice(1); // Skip the 'Country Name' column
  const indiaGDP = years.map(year => +indiaData[year]);
  const usGDP = years.map(year => +usData[year]);

  // Create scales for India and US
  const indiaScale = d3.scaleLinear().domain([d3.min(indiaGDP), d3.max(indiaGDP)]).range([0, 100]);
  const usScale = d3.scaleLinear().domain([d3.min(usGDP), d3.max(usGDP)]).range([0, 100]);

 

  // Create bar chart for US
  const usChart = d3.select('#usGDPChart')
    .attr('width', panelWidth)
    .attr('height', panelHeight);

  usChart.append('text')
    .attr('x', panelWidth / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('US GDP Timeline');

  usChart.append('g')
    .attr('transform', `translate(0, ${panelHeight-20})`)
    .call(d3.axisBottom(d3.scaleBand().domain(years).range([0, panelWidth])).tickFormat(d => d.substring(2, 4)))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')
    .attr('dy', '0.5em'); // Adjust vertical position

  usChart.append('g')
    .attr('transform', `translate(20, ${panelHeight-125})`) // Move the y-axis to the left
    .call(d3.axisLeft(usScale).ticks(5));

  usChart.selectAll('rect')
    .data(usGDP)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * (panelWidth / usGDP.length))
    .attr('y', d => panelHeight - usScale(d)-25)
    .attr('width', panelWidth / usGDP.length - 1)
    .attr('height', d => usScale(d))
    .attr('fill', 'blue');

  // Create bar chart for India
  const indiaChart = d3.select('#indiaGDPChart')
    .attr('width', panelWidth)
    .attr('height', panelHeight);

  indiaChart.append('text')
    .attr('x', panelWidth / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('India GDP Timeline');

  indiaChart.append('g')
    .attr('transform', `translate(0, ${panelHeight-20})`)
    .call(d3.axisBottom(d3.scaleBand().domain(years).range([0, panelWidth])).tickFormat(d => d.substring(2, 4)))
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('transform', 'rotate(-45)')
    .attr('dy', '0.5em'); // Adjust vertical position

  indiaChart.append('g')
    .attr('transform', `translate(20, ${panelHeight-125})`) // Move the y-axis to the left
    .call(d3.axisLeft(indiaScale).ticks(5));

  indiaChart.selectAll('rect')
    .data(indiaGDP)
    .enter()
    .append('rect')
    .attr('x', (d, i) => i * (panelWidth / indiaGDP.length))
    .attr('y', d => panelHeight - indiaScale(d)-25)
    .attr('width', panelWidth / indiaGDP.length - 1)
    .attr('height', d => indiaScale(d))
    .attr('fill', 'green');
});

// Literacy rates for India and US
const indiaLiteracyRate = 81;
const usLiteracyRate = 79;

// Create dataset for pie charts
const literacyDataUS = [ usLiteracyRate, 100 - usLiteracyRate];
const literacyDataIndia = [indiaLiteracyRate, 100 - indiaLiteracyRate];

// Colors for pie chart segments
const pieColors = ['#4CAF50', '#ECECEC', '#2196F3', '#ECECEC']; // Green for India, Blue for US

// Radius and center for pie charts
const radius = Math.min(panelWidth, panelHeight) / 4;
const center = [panelWidth / 2, panelHeight / 2]; // Center for US pie chart
const indiaCenter = [(panelWidth / 4) * 3, panelHeight / 2]; // Center for India pie chart

// ... (Previous code)

// Create pie chart for US
const usPieChart = d3.select('#usLiteracyChart')
  .attr('width', panelWidth)
  .attr('height', panelHeight)
  .append('g')
  .attr('transform', `translate(${center[0]}, ${center[1]})`);

const usPie = d3.pie();
const usArc = d3.arc().innerRadius(0).outerRadius(radius);

// Calculate total for percentage calculation
const usTotal = literacyDataUS.reduce((acc, value) => acc + value, 0);

usPieChart.selectAll('path')
  .data(usPie(literacyDataUS))
  .enter()
  .append('path')
  .attr('d', usArc)
  .attr('fill', (d, i) => pieColors[i])
  .append('title') // Add tooltips
  .text((d, i) => `${Math.round((d.data / usTotal) * 100)}%`);

// Add text labels with percentages
usPieChart.selectAll('text')
  .data(usPie(literacyDataUS))
  .enter()
  .append('text')
  .attr('transform', d => `translate(${usArc.centroid(d)})`)
  .attr('dy', '0.35em')
  .style('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('fill', 'black')
  .text(d => `${Math.round((d.data / usTotal) * 100)}%`);

// Create pie chart for India
const indiaPieChart = d3.select('#indiaLiteracyChart')
  .attr('width', panelWidth)
  .attr('height', panelHeight)
  .append('g')
  .attr('transform', `translate(${indiaCenter[0]}, ${indiaCenter[1]})`);

const indiaPie = d3.pie();
const indiaArc = d3.arc().innerRadius(0).outerRadius(radius);

// Calculate total for percentage calculation
const indiaTotal = literacyDataIndia.reduce((acc, value) => acc + value, 0);

indiaPieChart.selectAll('path')
  .data(indiaPie(literacyDataIndia))
  .enter()
  .append('path')
  .attr('d', indiaArc)
  .attr('fill', (d, i) => pieColors[i])
  .append('title') // Add tooltips
  .text((d, i) => `${Math.round((d.data / indiaTotal) * 100)}%`);

// Add text labels with percentages
indiaPieChart.selectAll('text')
  .data(indiaPie(literacyDataIndia))
  .enter()
  .append('text')
  .attr('transform', d => `translate(${indiaArc.centroid(d)})`)
  .attr('dy', '0.35em')
  .style('text-anchor', 'middle')
  .style('font-size', '12px')
  .style('fill', 'black')
  .text(d => `${Math.round((d.data / indiaTotal) * 100)}%`);

// ... (Previous code)

// Load unemployment data
d3.csv('data/UnempRate.csv').then(function(data) {
  // Extract data for India and US
  const indiaUnemploymentData = data.filter(d => d['Country'] === 'India');
  const usUnemploymentData = data.filter(d => d['Country'] === 'United States');

  // Extract years and unemployment rates
  const yearsUnemployment = indiaUnemploymentData.map(d => +d['Year']);
  const indiaUnemploymentRates = indiaUnemploymentData.map(d => +d['UnempRate']);
  const usUnemploymentRates = usUnemploymentData.map(d => +d['UnempRate']);

  // Create scales for India and US
  const indiaUnemploymentScale = d3.scaleLinear().domain([d3.min(indiaUnemploymentRates), d3.max(indiaUnemploymentRates)]).range([0, panelHeight]);
  const usUnemploymentScale = d3.scaleLinear().domain([d3.min(usUnemploymentRates), d3.max(usUnemploymentRates)]).range([0, panelHeight]);

  // ... (Previous code)

// Create line chart for US
const usUnemploymentChart = d3.select('#usUnemploymentChart')
.attr('width', panelWidth + 30) // Adjusted width to accommodate labels
.attr('height', panelHeight);

usUnemploymentChart.append('text')
.attr('x', panelWidth / 2)
.attr('y', 20)
.attr('text-anchor', 'middle')
.style('font-size', '16px')
.text('US Unemployment Rates (2013-2023)');

usUnemploymentChart.append('g')
.attr('transform', `translate(0, ${panelHeight - 20})`)
.call(
  d3.axisBottom(d3.scaleBand().domain(yearsUnemployment.reverse()).range([0, panelWidth])).tickFormat(d => d)
)
.selectAll('text')
.style('text-anchor', 'end')
.attr('transform', 'rotate(-45)')
.attr('dy', '0.5em');

usUnemploymentChart.append('g')
.attr('transform', `translate(20, 0)`)
.call(d3.axisLeft(usUnemploymentScale).ticks(5));

usUnemploymentChart.append('path')
.datum(usUnemploymentRates)
.attr('fill', 'none')
.attr('stroke', 'blue')
.attr('stroke-width', 2)
.attr('d', d3.line()
  .x((d, i) => i * (panelWidth / usUnemploymentRates.length) + 10) // Adjusted x-position
  .y(d => panelHeight - usUnemploymentScale(d) - 25) // Adjusted y-position
);

// Label each point with unemployment rates
usUnemploymentChart.selectAll('text.point-label')
.data(usUnemploymentRates)
.enter()
.append('text')
.attr('class', 'point-label')
.attr('x', (d, i) => i * (panelWidth / usUnemploymentRates.length) + 10)
.attr('y', d => panelHeight - usUnemploymentScale(d) - 10)
.text(d => d.toFixed(2));

// Create line chart for India
const indiaUnemploymentChart = d3.select('#indiaUnemploymentChart')
.attr('width', panelWidth)
.attr('height', panelHeight);

indiaUnemploymentChart.append('text')
.attr('x', panelWidth / 2)
.attr('y', 20)
.attr('text-anchor', 'middle')
.style('font-size', '16px')
.text('India Unemployment Rates (2013-2023)');

indiaUnemploymentChart.append('g')
.attr('transform', `translate(0, ${panelHeight - 20})`)
.call(
  d3.axisBottom(d3.scaleBand().domain(yearsUnemployment.reverse()).range([0, panelWidth])).tickFormat(d => d)
)
.selectAll('text')
.style('text-anchor', 'end')
.attr('transform', 'rotate(-45)')
.attr('dy', '0.5em');

indiaUnemploymentChart.append('g')
.attr('transform', `translate(20, 0)`)
.call(d3.axisLeft(indiaUnemploymentScale).ticks(5));

indiaUnemploymentChart.append('path')
.datum(indiaUnemploymentRates)
.attr('fill', 'none')
.attr('stroke', 'green')
.attr('stroke-width', 2)
.attr('d', d3.line()
  .x((d, i) => i * (panelWidth / indiaUnemploymentRates.length))
  .y(d => panelHeight - indiaUnemploymentScale(d))
);

// Label each point with unemployment rates
indiaUnemploymentChart.selectAll('text.point-label')
.data(indiaUnemploymentRates)
.enter()
.append('text')
.attr('class', 'point-label')
.attr('x', (d, i) => i * (panelWidth / indiaUnemploymentRates.length) + 10)
.attr('y', d => panelHeight - indiaUnemploymentScale(d) - 10)
.text(d => d.toFixed(2));
});
// ... (Rest of the code)
