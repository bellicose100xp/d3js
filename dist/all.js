'use strict';

/**
 * Created by admin on 11/5/2015.
 */
(function () {
    'use strict';

    var width = 400;
    var _height = 200;
    var padding = 2;
    var yAxisPad = 30;
    var dataset = [5, 10, 20, 15, 25, 11, 22, 17, 3, 8, 18, 7];
    var average = 12;
    var filteredDataset = [];

    var filterDataset = function filterDataset(filterQuery) {
        if (filterQuery === 'all') {
            return dataset;
        }

        if (filterQuery === 'aboveAverage') {
            return dataset.filter(function (val) {
                return val > average;
            });
        }

        if (filterQuery === 'belowAverage') {
            return dataset.filter(function (val) {
                return val <= average;
            });
        }
    };

    document.querySelector('#selection').addEventListener('click', function (event) {
        if (event.target.value) {
            filteredDataset = filterDataset(event.target.value);
            updateBarChart();
        }
    });

    var parentSvg = d3.select('body').append('svg');

    parentSvg.attr({
        width: width,
        'max-width': width,
        height: _height + 40,
        id: 'bar-chart'
    });

    // let svg = d3.select('body')
    var svg = d3.select('#bar-chart').append('svg').attr('width', width).attr('height', _height);

    var colorPicker = function colorPicker(data) {
        return data <= 20 ? '#666666' : '#FF0033';
    };

    var xScale = d3.scale.linear().domain([0, dataset.length]).range([yAxisPad + 5, width]);

    var yScale = d3.scale.linear().domain([0, d3.max(dataset, function (d) {
        return d;
    })]).range([_height - 10, 10]);

    var yAxis = d3.svg.axis().scale(yScale).orient('left').ticks(4);

    // ============= BRUSH =================
    var brushScale = d3.scale.linear().domain([0, d3.max(dataset, function (d) {
        return d;
    })]).range([yAxisPad + 5, width]);

    var brush = d3.svg.brush().x(brushScale).extent([7, 15]);

    brush.on('brushend', function () {
        var minBrushVal = brush.extent()[0];
        var maxBrushVal = brush.extent()[1];
        filteredDataset = dataset.filter(function (val) {
            return val >= minBrushVal && val <= maxBrushVal;
        });
        //console.log(filteredDataset);
        updateBarChart();
    });

    // let brushSvg = d3.select('body')
    var brushSvg = d3.select('#bar-chart').append('svg').attr({
        width: width
    });

    var brushGroup = brushSvg.append('g');
    brush(brushGroup);
    brushGroup.selectAll('rect').attr('height', 30);
    brushGroup.selectAll('.background').style({
        fill: '#4b9e9e',
        visibility: 'visible'
    });
    brushGroup.selectAll(".extent").style({ fill: "#78C5C5", visibility: "visible" });
    brushGroup.selectAll(".resize rect").style({ fill: "#276C86", visibility: "visible" });

    brushGroup.attr('transform', 'translate(0, ' + (_height + 2) + ')');

    //============= CREATE =======================
    var addBarChart = function addBarChart() {
        var rect = svg.selectAll('rect').data(dataset).enter().append('rect').attr({
            x: function x(data, index) {
                return xScale(index);
            },
            y: function y(data) {
                return yScale(data);
            },
            width: function width(data, index) {
                return (xScale(dataset.length) - yAxisPad) / dataset.length - padding;
            },
            height: function height(data) {
                return _height - yScale(data);
            },
            fill: function fill(data) {
                return colorPicker(data);
            },
            id: function id(d, i) {
                return 'bar' + i;
            }
        }).on('mouseover', function (d, i) {
            d3.select('#bar' + i).attr({
                fill: 'magenta'
            });

            var text = svg.append('text').text(d).attr({
                'text-anchor': 'middle',
                x: parseFloat(d3.select(this).attr('x')) + parseFloat(d3.select(this).attr('width')) / 2,
                y: parseFloat(d3.select(this).attr('y')) + 17,
                id: 'tooltip',
                fill: '#fff',
                'font-size': 16,
                'font-family': 'sans-serif'
            });
        }).on('mouseout', function (d, i) {
            d3.select('#bar' + i).attr({
                fill: function fill(d) {
                    return colorPicker(d);
                }
            });

            d3.select('#tooltip').remove();
        });

        var yAxisGroup = svg.append('g');
        //.attr({class: 'axis'})
        yAxisGroup.call(yAxis).attr('transform', 'translate(' + yAxisPad + ', 0)');

        yAxisGroup.selectAll('path, line').style({
            fill: 'none',
            stroke: '#666',
            'shape-rendering': 'crispEdges'
        });

        yAxisGroup.selectAll('text').style({
            'font-family': 'sans-serif',
            'font-size': 15,
            fill: '#666'
        });
    };

    //============= UPDATE =======================
    var updateBarChart = function updateBarChart() {
        var rect = svg.selectAll('rect').data(filteredDataset);

        //add bar it it does not exist for dataset;
        rect.enter().append('rect').attr({
            fill: 'white',
            y: _height
        });

        //transition these elements
        rect.transition().duration(500).attr('fill', function (data) {
            return colorPicker(data);
        }).attr('x', function (data, index) {
            return xScale(index);
        }).attr('y', function (data) {
            return yScale(data);
        }).attr('width', function (data, index) {
            return (xScale(dataset.length) - yAxisPad) / dataset.length - padding;
        }).attr('height', function (data) {
            return _height - yScale(data);
        });

        rect.attr({
            id: function id(d, i) {
                return 'bar' + i;
            }
        }).on('mouseover', function (d, i) {
            d3.select('#bar' + i).attr({
                fill: 'magenta'
            });

            var text = svg.append('text').text(d).attr({
                'text-anchor': 'middle',
                x: parseFloat(d3.select(this).attr('x')) + parseFloat(d3.select(this).attr('width')) / 2,
                y: parseFloat(d3.select(this).attr('y')) + 17,
                id: 'tooltip',
                fill: '#fff',
                'font-size': 16,
                'font-family': 'sans-serif'
            });
        }).on('mouseout', function (d, i) {
            d3.select('#bar' + i).attr({
                fill: function fill(d) {
                    return colorPicker(d);
                }
            });

            d3.select('#tooltip').remove();
        });

        rect.exit().transition().duration(500).attr('y', _height).remove();

        var yAxisGroup = svg.append('g');

        yAxisGroup.call(yAxis).attr('transform', 'translate(' + yAxisPad + ', 0)');

        yAxisGroup.selectAll('path, line').style({
            fill: 'none',
            stroke: '#666',
            'shape-rendering': 'crispEdges'
        });

        yAxisGroup.selectAll('text').style({
            'font-family': 'sans-serif',
            'font-size': 15,
            fill: '#666'
        });
    };

    addBarChart();

    /*
     // show all data
     svg.selectAll('text')
     .data(dataset)
     .enter()
     .append('text')
     .text(data => data)
     .attr({
     x: (d, i) => ((width / dataset.length) * i) + (((width / dataset.length) - padding) / 2) ,
     y: d => height - (d * 4) +14,
     'text-anchor': 'middle',
     'font-size': 12,
     'font-family': 'sans-serif',
     fill: '#ffffff'
     });
     */
})();
'use strict';

(function () {
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

            var parentSvg = d3.select('body').append('div').style({
                width: w + 'px',
                height: h * 2 + 'px'
            }).attr({
                id: 'line-chart'
            });

            var svg = d3.select('#line-chart').append('svg').attr({ width: w, height: h }).append('path').attr({
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

            d3.select('#line-chart').append('table').selectAll('tr').data(metrics).enter().append('tr').append('td').text(function (d) {
                return d;
            });
        };

        buildLines();
        showTotals();
    });
})();