(function () {
    'use strict';
    let h = 100;
    let w = 400;
    let ds;
    let total;
    let average;

    d3.csv('MonthlySales.csv', (error, data) => {

        if (error) {
            console.log(error);
        }

        if (data) {
            ds = data;
        }

        let buildLines = () => {
            let lineFun = d3.svg.line()
                .x(d => (d.month - 20130001) / 3.2)
                .y(d => h - d.sales)
                .interpolate('linear');

            let parentSvg = d3.select('body')
                .append('div')
                .style({
                    width: `${w}px`,
                    height: `${h * 2}px`
                })
                .attr({
                    id: 'line-chart'
                });

            let svg = d3.select('#line-chart')
                .append('svg')
                .attr({width: w, height: h})
                .append('path')
                .attr({
                    d: lineFun(ds),
                    fill: 'none',
                    stroke: 'purple',
                    'stroke-width': 2
                })
        };

        let showTotals = () => {
            let metrics = [];

            let total = ds.reduce((prev, curr) => prev + Number(curr.sales), 0);
            metrics.push(`Total: ${total}`);

            average = total / ds.length;
            metrics.push(`Average: ${average.toFixed(2)}`);

            d3.select('#line-chart')
                .append('table')
                .selectAll('tr')
                .data(metrics)
                .enter()
                .append('tr')
                .append('td')
                .text(d => d);
        };

        buildLines();
        showTotals();

    });
}());

