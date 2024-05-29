/*
*    main.js
*/

var margin = {top: 10, right: 10,  bottom: 100, left:100};
var width = 600;
var height = 400;

var years;
var colors = {asia: "blue", americas: "red", europe: "green", africa: "purple"};
var time = d3.transition().duration(500);

var pause = false;
var index = 0;
var max = 0;

var g = d3.select('#chart-area')
.append('svg')
.attr('width', width + margin.right + margin.left)
.attr('height', height + margin.top + margin.bottom + 1)
.attr('fill', 'black')
.append("g")
.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var xLabel = g.append("text")
        .attr("class", "y axis-label")
        .attr("x", width - 60)
        .attr("y", height - 20)
        .attr("font-size", "28px")
        .attr("text-anchor", "right")
        .style("fill","gray");

var x = d3.scaleLog().domain([142, 150000]).range([0, width]).base(10);
var y = d3.scaleLinear().range([0, height]).domain([90, 0]);
var area = d3.scaleLinear().domain([2000, 1400000000]).range([25*Math.PI, 1500*Math.PI]);

d3.json("data/data.json").then(function(data){
	years = data.map ( (d) => {
		return d.year;
	});

	Data = data.map((year) => {
		return year["countries"].filter((country) => {
			var can = (country.income && country.life_exp);
			return can;
		}).map((country) => {
			country.income = +country.income;
			country.life_exp = +country.life_exp;
			return country;
		})
	});

	max = years.length;
	
	var leftAxis = d3.axisLeft(y);

	g.append("g")
    	.attr("class", "left axis")
		.call(leftAxis);

    var bottomAxis = d3.axisBottom(x).tickValues([400, 4000, 40000] )
		.tickFormat( d3.format("($d"));

     g.append("g")
		.attr("class", "bottom axis")
		.attr("transform", "translate(0, " + (height) + ")")
		.call(bottomAxis);

	var yLabel = g.append("text")
	.attr("class", "y axis-label")
	.attr("x", - (height / 2 ))
	.attr("y", -60)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.style("fill","black")
	.text("Life Expectancy (Years)");

	g.append("text")
	.attr("class", "y axis-label")
	.attr("x", width / 2)
	.attr("y", height + margin.top)
	.attr("transform", "translate(0, " + (40) + ")")
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.style("fill","black")
	.text("GDP Per Capita ($)");

	var continents = ["africa", "americas", "asia", "europe"];
	var boxContinents = g.append("g").attr("transform", "translate(" + (width - 10) + "," + (height - 125) + ")");

	continents.forEach((continent, i) => {
		var boxRow = boxContinents.append("g").attr("transform", "translate(0, " + (i * 20) + ")");
		boxRow.append("rect").attr("width", 10).attr("height", 10).attr("fill", colors[continent]);
		boxRow.append("text").attr("x", -10).attr("y", 10).attr("text-anchor", "end").style("text-transform", "capitalize").text(continent);
	});

	update(Data[index]);
	$("#date-slider").slider({
		range: "r",
		animate: true,
		max: 2014, 
		min: 1800,
		step: 1,
		value:1800,

		slide:(event, ui) => {	
			pause = true;
			$( "#play-button" ).text("Play");
				index = ui.value - 1800;
				update(Data[index]);
			}

		});

		$("#play-button").on("click", (e ) => {
		var interval;
		if ($( "#play-button" ).text( ) == "Play"){
			pause = false;
			$( "#play-button" ).text("Pause");
			interval = setInterval(step, 1000);
			
		} else {
			$( "#play-button" ).text("Play");
			clearInterval(interval);
			pause = true;
		}
	});

	$("#reset-button").on("click", () => {
		pause = true;
		$( "#play-button" ).text("Play");
		index = 0;
		$("#date-slider").slider({
			value: 1800
		});
		update(Data[index]);

	})

	$("#continent-select").on("change", ( ) => {
		update(Data[index]);
	});

	function update(data){
		let auxData = data;
		var continent = $("#continent-select").val();

		xLabel.text(years[index]);

		auxData = auxData.filter((d) => {
			if (continent == "all") { return true; }
			else {
				return d.continent == continent;
			}
		});

		$("#date-slider").slider({
			value: 1800 + index
		});

		$("#year").text(1800 + index);

		var circles = g.selectAll('circle').data(auxData);

		circles.exit().remove();

		circles.enter().append("circle")
			.attr("fill", (d) => {return colors[d.continent]})
			.attr("cx", (d) => { return x(d.income); })
			.attr("cy", (d) => { return y(d.life_exp); })
			.attr("r", (d) => {return Math.sqrt(area(d.population)/ Math.PI)})
			.merge(circles)
			.transition(time)
			.attr("fill", (d) => {return colors[d.continent]})
			.attr("cx", (d) => { return x(d.income); })
			.attr("cy", (d) => { return y(d.life_exp); })
			.attr("r", (d) => {return Math.sqrt(area(d.population)/ Math.PI)});
	}

	function step(){
		if (!pause){
			index++;
			index%=214;
			update(Data[index]);
		}
	}
})