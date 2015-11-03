'use strict';

var h = 100;
var w = 400;
var ds = undefined;
var total = undefined;
var average = undefined;

d3.csv('MonthlySales.csv', function (error, data) {

    if (error) {
        console.log(error);
    }

    if (data) {
        ds = data;
    }

    var buildLines = function buildLines() {
        var lineFun = d3.svg.line().x(function (d) {
            return (d.month - 20130001) / 3.2;
        }).y(function (d) {
            return h - d.sales;
        }).interpolate('linear');

        var svg = d3.select('body').append('svg').attr({ width: w, height: h }).append('path').attr({
            d: lineFun(ds),
            fill: 'none',
            stroke: 'purple',
            'stroke-width': 2
        });
    };

    var showTotals = function showTotals() {
        var metrics = [];

        var total = ds.reduce(function (prev, curr) {
            return prev + Number(curr.sales);
        }, 0);
        metrics.push('Total: ' + total);

        average = total / ds.length;
        metrics.push('Average: ' + average.toFixed(2));

        d3.select('body').append('table').selectAll('tr').data(metrics).enter().append('tr').append('td').text(function (d) {
            return d;
        });
    };

    buildLines();
    showTotals();
});