/**
 * Created by admin on 11/5/2015.
 */
(function () {
    'use strict';
    const width = 400;
    const height = 200;
    const padding = 2;
    const yAxisPad = 30;
    const dataset = [5, 10, 20, 15, 25, 11, 22, 17, 3, 8, 18, 7];
    const average = 12;
    let filteredDataset = [];

    let filterDataset = filterQuery => {
        if (filterQuery === 'all') {
            return dataset;
        }

        if (filterQuery === 'aboveAverage') {
            return dataset.filter(val => val > average);
        }

        if (filterQuery === 'belowAverage') {
            return dataset.filter(val => val <= average);
        }

    };

    document.querySelector('#selection').addEventListener('click', event => {
        if (event.target.value) {
            filteredDataset = filterDataset(event.target.value);
            updateBarChart();
        }
    });

    let parentSvg = d3.select('body')
        .append('svg');

    parentSvg.attr({
        width: width,
        'max-width': width,
        height: height + 40,
        id: 'bar-chart'
    });

    // let svg = d3.select('body')
    let svg = d3.select('#bar-chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    let colorPicker = data => {
        return data <= 20 ? '#666666' : '#FF0033';
    };

    let xScale = d3.scale
        .linear()
        .domain([0, dataset.length])
        .range([yAxisPad + 5, width]);

    let yScale = d3.scale
        .linear()
        .domain([0, d3.max(dataset, d => d)])
        .range([height - 10, 10]);

    let yAxis = d3.svg
        .axis()
        .scale(yScale)
        .orient('left')
        .ticks(4);

// ============= BRUSH =================
    let brushScale = d3.scale
        .linear()
        .domain([0, d3.max(dataset, d => d)])
        .range([yAxisPad + 5, width]);


    let brush = d3.svg.brush()
        .x(brushScale)
        .extent([7, 15]);

    brush.on('brushend', () => {
        let minBrushVal = brush.extent()[0];
        let maxBrushVal = brush.extent()[1];
        filteredDataset = dataset.filter(val => val >= minBrushVal && val <= maxBrushVal);
        //console.log(filteredDataset);
        updateBarChart();
    });

    // let brushSvg = d3.select('body')
    let brushSvg = d3.select('#bar-chart')
        .append('svg')
        .attr({
            width: width
        });

    let brushGroup = brushSvg.append('g');
    brush(brushGroup);
    brushGroup.selectAll('rect').attr('height', 30);
    brushGroup.selectAll('.background').style({
        fill: '#4b9e9e',
        visibility: 'visible'
    });
    brushGroup.selectAll(".extent")
        .style({fill: "#78C5C5", visibility: "visible"});
    brushGroup.selectAll(".resize rect")
        .style({fill: "#276C86", visibility: "visible"});

    brushGroup.attr('transform', `translate(0, ${height + 2})`);

//============= CREATE =======================
    let addBarChart = () => {
        let rect = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr({
                x: (data, index) => xScale(index),
                y: data => yScale(data),
                width: (data, index) => ((xScale(dataset.length) - yAxisPad) / dataset.length) - padding,
                height: data => height - yScale(data),
                fill: data => colorPicker(data),
                id: (d, i) => `bar${i}`
            })
            .on('mouseover', function (d, i) {
                d3.select('#bar' + i)
                    .attr({
                        fill: 'magenta'
                    });

                let text = svg.append('text')
                    .text(d)
                    .attr({
                        'text-anchor': 'middle',
                        x: parseFloat(d3.select(this).attr('x')) + (parseFloat(d3.select(this).attr('width')) / 2),
                        y: parseFloat(d3.select(this).attr('y')) + 17,
                        id: 'tooltip',
                        fill: '#fff',
                        'font-size': 16,
                        'font-family': 'sans-serif'
                    });

            })
            .on('mouseout', function (d, i) {
                d3.select('#bar' + i)
                    .attr({
                        fill: d => colorPicker(d)
                    });

                d3.select('#tooltip').remove();
            });

        let yAxisGroup = svg.append('g');
        //.attr({class: 'axis'})
        yAxisGroup.call(yAxis)
            .attr('transform', `translate(${yAxisPad}, 0)`);

        yAxisGroup.selectAll('path, line')
            .style({
                fill: 'none',
                stroke: '#666',
                'shape-rendering': 'crispEdges'
            });

        yAxisGroup.selectAll('text')
            .style({
                'font-family': 'sans-serif',
                'font-size': 15,
                fill: '#666'
            })

    };

//============= UPDATE =======================
    let updateBarChart = () => {
        let rect = svg.selectAll('rect')
            .data(filteredDataset);

        //add bar it it does not exist for dataset;
        rect.enter()
            .append('rect')
            .attr({
                fill: 'white',
                y: height
            });

        //transition these elements
        rect.transition()
            .duration(500)
            .attr('fill', data => colorPicker(data))
            .attr('x', (data, index) => xScale(index))
            .attr('y', data => yScale(data))
            .attr('width', (data, index) => ((xScale(dataset.length) - yAxisPad) / dataset.length) - padding)
            .attr('height', data => height - yScale(data));

        rect.attr({
                id: (d, i) => `bar${i}`
            })
            .on('mouseover', function (d, i) {
                d3.select('#bar' + i)
                    .attr({
                        fill: 'magenta'
                    });

                let text = svg.append('text')
                    .text(d)
                    .attr({
                        'text-anchor': 'middle',
                        x: parseFloat(d3.select(this).attr('x')) + (parseFloat(d3.select(this).attr('width')) / 2),
                        y: parseFloat(d3.select(this).attr('y')) + 17,
                        id: 'tooltip',
                        fill: '#fff',
                        'font-size': 16,
                        'font-family': 'sans-serif'
                    });
            })
            .on('mouseout', function (d, i) {
                d3.select('#bar' + i)
                    .attr({
                        fill: d => colorPicker(d)
                    });

                d3.select('#tooltip').remove();
            });

        rect.exit()
            .transition()
            .duration(500)
            .attr('y', height)
            .remove();

        let yAxisGroup = svg.append('g');

        yAxisGroup
            .call(yAxis)
            .attr('transform', `translate(${yAxisPad}, 0)`);

        yAxisGroup.selectAll('path, line')
            .style({
                fill: 'none',
                stroke: '#666',
                'shape-rendering': 'crispEdges'
            });

        yAxisGroup.selectAll('text')
            .style({
                'font-family': 'sans-serif',
                'font-size': 15,
                fill: '#666'
            })
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
}());