// @TODO: YOUR CODE HERE!
//json structure:
// id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228
// 1,Alabama,AL,19.3,0.5,38.6,0.2,42830,598,13.9,12.7,15.1,33.5,32.1,35,21.1,19.8,22.5,
// 2,Alaska,AK,11.2,0.9,33.3,0.3,71583,1784,15,13.3,16.6,29.7,27.8,31.6,19.9,18.2,21.6,

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./data/data.csv").then(function(censusData) { 

  console.log(censusData);

   // Parse Data/Cast as numbers
  censusData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    });
    
  // Create scale functions
  var xLinearScale = d3.scaleLinear()
  .domain([8, d3.max(censusData, d => d.poverty)])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(censusData, d => d.healthcare)])
  .range([height, 0]);

  //  Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  //  Create Circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(censusData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.healthcare))
  .attr("r", 18)
  .attr("fill", "blue")
  .attr("opacity", ".5");

  var circleText = chartGroup.append("g")
  .selectAll("text")
  .data(censusData)
  .enter()
  .append("text")
  .text(d => d.abbr)
  .attr("x", d => xLinearScale(d.poverty))  
  .attr("y", d => yLinearScale(d.healthcare) + 3)  
  .attr("font-size", "12px")
  .attr("text-anchor", "middle")
  .attr("fill", "#FFFFFF");

  // Initialize tool tip  
  // (To use the .tip shortcut, you have to import the tooltip script in the html.)
  // https://cdnjs.cloudflare.com/ajax/libs/d3-tip/0.7.1/d3-tip.min.js
  var toolTip = d3.tip()
  .attr("class", "d3-tip")
  .offset([80, -60])
  .html(function(d) {
    return (`${d.state}<br>Poverty: ${d.poverty}% <br>Healthcare: ${d.healthcare}% `);
  });

  // Create tooltip in the chart
  chartGroup.call(toolTip);

  // Create event listeners to display and hide the tooltip
  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  // Create chart group for X Axis
  chartGroup.append("text")
  .attr("transform", `translate(${width / 2}, ${height + 20})`)
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "poverty") // value to grab for event listener
  .text("% In Poverty");

  //Create a chart group for Y Axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left +40)
    .attr("x", 0 - (height / 1.5))
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)");

});
