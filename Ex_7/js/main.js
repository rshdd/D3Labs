/*
*    main.js
*/

var margin = {top:10, right:10, bottom:100, left:100};
var width = 600;
var height = 400;

var flag = true;

var x = d3.scaleBand().range([0, width]).paddingInner(0.2).paddingOuter(0.3);
var y = d3.scaleLinear().range([height, 0]);

var g = d3.select("#chart-area")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")

var xAxisGroup = g.append("g")
.attr("class", "bottom axis")
.attr("transform", "translate(0, " + height + ")")

var yAxisGroup = g.append("g").attr("class", "y axis")

var yLabel = g.append("text")
.attr("class", "y axis-label")
.attr("x", - height/2)
.attr("y", -60)
.attr("font-size", "30px")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")
.text("Revenue (dlls.)");


var x = d3.scaleBand().range([0, width]).padding(0.2);
var y = d3.scaleLinear().range([height, 0]);

    
function update(data) {
    var name = flag ? "revenue" : "profit";

    x.domain(data.map((d) => d.month));
    y.domain([0, d3.max(data, (d) => d.revenue)]);

    var bottomAxis = d3.axisBottom(x);

    xAxisGroup.call(bottomAxis)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("filled", "white")
    .attr("text-anchor", "middle");

    var yAxisCall = d3.axisLeft(y)
    .ticks(10)
    .tickFormat((d) => "$" + d/1000 + "K");
    yAxisGroup.call(yAxisCall);

    g.append("text")
    .attr("class", "x axis-label")
    .attr("x", width/2)
    .attr("y", height + 140)
    .attr("font-size", "30px")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(0, -70)")
    .text("Month");

    var label = flag ? "Revenue" : "Profit";
    yLabel.text(label);

    var rects = g.selectAll("rect").data(data);
    rects.exit().remove();

    rects.attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d[name]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d[name]));

    rects.enter()
    .append("rect")
    .attr("x", (d) => x(d.month))
    .attr("y", (d) => y(d[name]))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - y(d[name]))
    .attr("fill", "yellow")
        
}

d3.json("data/revenues.json").then((data)=> {
	data.forEach((d)=>{
		d.revenue = +d.revenue;
        d.profit= +d.profit;
	});
    
    d3.interval( ( ) => { 
        var aux = flag ? data:data.slice(1);
        update(aux); 
        flag = !flag;
    }, 2000);
    update(data);

}).catch((error)=> {
    console.log(error);
});
