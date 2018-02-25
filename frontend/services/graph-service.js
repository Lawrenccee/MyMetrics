function GraphService() {
  const service = {
    createChart: (graphId, { weightLog, sodiumLog, fluidLog }) => {
      this.chart = Highcharts.chart(graphId, {

        title: {
          text: "My Metrics"
        },
        yAxis: {
          title: {
            text: 'lbs/mg/ml'
          },
          plotLines: [{
            value: 2000,
            color: 'red',
            dashStyle: 'shortdash',
            width: 2,
            label: {
              text: 'Sodium and Fluid Thresholds'
            }
          }]
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle'
        },
        tooltip: {
          xDateFormat: '%Y %b %e',
        },
        xAxis: {
          type: 'datetime',
          labels: {
            format: '{value:%Y-%b-%e}'
          }
        },

        series: [{
          name: 'Sodium',
          data: sodiumLog,
          tooltip: {
            valueDecimals: 2
          }
        }, {
          name: 'Fluid',
          data: fluidLog,
          tooltip: {
            valueDecimals: 2
          }
        }, {
          name: 'Weight',
          data: weightLog,
          tooltip: {
            valueDecimals: 2
          },
        }],

        responsive: {
          rules: [{
            condition: {
              minWidth: 0,
            },
            chartOptions: {
              legend: {
                verticalAlign: 'top',
                layout: 'horizontal',
                align: 'center',
                itemStyle: {
                  fontSize: "20px",
                },
              }
            }
          }]
        }
      });
    }
  };
  
  return service;
}

angular.
  module("myMetricsApp").
  factory('GraphService', GraphService);