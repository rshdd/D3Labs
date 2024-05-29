/*
*    main.js
*/

/*
d3.csv("data/ages.csv").then((data)=> {
    console.log(data);
});
d3.tsv("data/ages.tsv").then((data)=> {
    console.log(data);
});
d3.json("data/ages.json").then((data)=> {
    console.log(data);
});
*/

var aux = [];

d3.json("data/ages.json").then((data)=> {
	data.forEach((d)=>{
		d.age = +d.age;
        aux.push(d.age)
	});
	console.log(data);

    var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);  
    var circles = svg.selectAll("circle").data(aux);  
    circles.enter()
        .append("circle")
            .attr("cx", (d,i) => { return (i * 50) + 10})
            .attr("cy", 100)
            .attr("r", (d) => { return d; })
            .attr("fill",(d) => { 
                if(d > 10){
                    return ("red");
                } else {
                    return ("green");
                }
            });
}).catch((error) => {
    console.log(error);
});


