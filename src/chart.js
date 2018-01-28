import Highcharts from 'highcharts';

export const show = (data) => {
    return Highcharts.chart('container', {
        title: {
            text: 'Cost by Epoch'
        },
        xAxis: {
            max: 1000
        },
        yAxis: {
            min: 0
        },
        series: [{
            data
        }]
    });
};
