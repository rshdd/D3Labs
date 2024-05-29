/*
*    main.js
*/
var aux = [];

d3.json("data/buildings.json").then((data)=> {
	data.forEach((d)=>{
		d.height = +d.height;
        aux.push(d.height)
	});

    console.log(aux);

    var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);  
    var rectangles = svg.selectAll("rect").data(aux);  
    rectangles.enter().append("rect")
    .attr("x",(d,i)=>{
        return (i*21);
    })
    .attr("y",(d,i)=>{
        return (900-d);
    })
    .attr("width",20)
    .attr("height",(d)=>{return d;})
    .attr("fill","red");
}).catch((error) => {
    console.log(error);
});


