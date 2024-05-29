/*
*    main.js
*/

var svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);    
var circle = svg.append("circle").attr("cx", 90).attr("cy", 150).attr("r", 70).attr("fill", "green");
var rect = svg.append("rect").attr("x", 80).attr("y", 40).attr("width", 20).attr("height", 20).attr("fill","black");