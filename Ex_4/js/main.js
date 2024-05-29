/*
*    main.js
*/


const svg = d3.select("#chart-area").append("svg").attr('width', 500).attr('height', 500);

d3.json("data/buildings.json").then((data)=> {
	var aux = data.map((d) => +d.height);
  
    var x = d3.scaleBand()
      .domain(aux)
      .range([0, 500])
      .paddingInner(0)
      .paddingOuter(0);
  
    var y = d3.scaleLinear()
      .domain([0, 900])
      .range([0, 500]);

    var color = d3.scaleOrdinal()
      .domain(aux)
      .range(d3.schemeSet3);

    var rectangles = svg.selectAll('rect').data(aux);

    rectangles.enter()
    .append('rect')
    .attr('x', (d) => {return x(d);})
    .attr('y', (d) => {return 500 - y(d);})
    .attr('width', 20)
    .attr('height', (d) => {return y(d);})
    .attr('fill', (d) => {return color(d);});

}).catch((error) => {
    console.log(error);
});


