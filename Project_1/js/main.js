/*
*    main.js
*/

var margin = {top: 10, right: 10, bottom: 100, left:100}; 
var width = 600;
var height = 400;

var g = d3.select('#chart-area')
    .append('svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom + 1)
        .attr('fill', 'black')
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

d3.json('data/revenues.json').then((data) => {
    var max = 0;
    data.forEach((d)=>{
        d.revenue = +d.revenue;
        if (d.revenue > max){
            max = d.revenue;
        }
    });

    var months = data.map ((d) => {return d.month;});

    var x = d3.scaleBand()
        .domain(months)
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    var y = d3.scaleLinear()
        .domain([max, 0])
        .range([0, height]);
        
    var rectangles = g.selectAll('rect').data(data)

    rectangles.enter()
    .append('rect')
    .attr('x', (d) => {return x(d.month);})
    .attr('y', (d) => {return y(d.revenue);})
    .attr('width', x.bandwidth())
    .attr('height', (d) => {return height - y(d.revenue);})
    .attr('fill', 'yellow');
            
    var bottomAxis = d3.axisBottom(x);
    g.append("g")
    .attr("class", "bottom axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(bottomAxis)
    .selectAll("text")
    .attr("y", "20")
    .attr("x", "15")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(0)");

    var yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat((d) => { return "$" +d/1000 + "K"; });

    g.append("g")
    .attr("class", "left axis")
    .call(yAxisCall);

    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", (width / 2))
    .attr("y", height + 140)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -50)")
    .text("Months");

    g.append("text")
    .attr("class", "y axis-label")
    .attr("x", - (height / 2))
    .attr("y", -60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Revenue (dlls.)");

}).catch((error) => {
    console.log(error);
});