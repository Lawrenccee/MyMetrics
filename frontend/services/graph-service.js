function GraphService() {
  const service = {
    createChart: (graphId, { weightLog, sodiumLog, fluidLog }) => {
      this.chart = Highcharts.chart(graphId, {
        title: {
          text: "BioMetrics Log",
          style: {
            fontSize: "2.5vh",
          },
          y: 20,
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
          xDateFormat: '%b %e %Y',
        },
        xAxis: {
          type: 'datetime',
          labels: {
            format: '{value: %b %e}'
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
                  fontSize: "2.5vh",
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