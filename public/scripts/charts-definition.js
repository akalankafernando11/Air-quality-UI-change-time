// Create the charts when the web page loads
window.addEventListener('load', onload);

function onload(event) {
    //chartA = createAllChart();
    chartT = createTemperatureChart();
    chartH = createHumidityChart();
    chartco2 = createCO2Chart();
    chartco = createCOChart();
}

// Create Temperature Chart
/*function createAllChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart',
      type: 'column' 
    },
    series: [
      {
        name: 'Room Temperature',
        color: '#16e7cb' 
      },
      {
        name: 'Room Humidity',
        color: '#00add6' 
      },
      {
        name: 'Room CO2',
        color: '#e1e437' 
      },
      {
        name: 'Room CO',
        color: '#e91616' 
      }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      series: { 
        color: '#16e7cb' 
      }
    },
    xAxis: {
      title: {
        text: 'Date'
      },
      type: 'datetime',
        
      // Use the date format in the
      // labels property of the chart
      labels: {
        formatter: function() {
          return Highcharts.dateFormat('%H:%M:%S %a', //%d %b %Y',
                                        this.value);
        }
      }
    },
    yAxis: {
      /*title: { 
        text: 'Temperature Celsius Degrees' 
      }*/
/*   },
    credits: { 
      enabled: false 
    }
  });
  return chart;
}*/

// Create Temperature Chart
function createTemperatureChart() {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart-temperature',
            //type: 'column'
            type: 'line',
        },
        series: [
            {
                lineWidth: 1, // Use a thin line width
                name: 'Room Temperature',
            },
        ],
        title: {
            text: undefined,
        },
        plotOptions: {
            series: {
                color: '#16e7cb',
            },
        },
        xAxis: {
            title: {
                text: 'Date',
            },
            type: 'datetime',

            // Use the date format in the
            // labels property of the chart
            labels: {
                formatter: function() {
                  return Highcharts.dateFormat('%m/%d/%Y %H:%M:%S', this.value);
                }
              }
        },
        yAxis: {
            title: {
                text: 'Average of the Temperature Celsius Degrees',
            },
        },
        credits: {
            enabled: false,
        },
    });
    return chart;
}

// Create Humidity Chart
function createHumidityChart() {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart-humidity',
            //type: 'column'
            type: 'line',
        },
        series: [
            {
                lineWidth: 1, // Use a thin line width
                name: 'Room Humidity',
            },
        ],
        title: {
            text: undefined,
        },
        plotOptions: {
            series: {
                color: '#00add6',
            },
        },
        xAxis: {
            title: {
                text: 'Date',
            },
            type: 'datetime',

            // Use the date format in the
            // labels property of the chart
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat(
                        '%H:%M:%S',//'%A ',//%d %b %Y', //%a %d %b %Y',
                        this.value
                    );
                },
            },
        },
        yAxis: {
            title: {
                text: 'Average of the Humidity (%)',
            },
        },
       /* credits: {
            enabled: false,
        },*/
    });
    return chart;
}

// Create Pressure Chart
function createCO2Chart() {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart-co2',
            //type: 'column'
            type: 'line',
        },
        series: [
            {
                lineWidth: 1, // Use a thin line width
                name: 'Room CO2',
            },
        ],
        title: {
            text: undefined,
        },
        plotOptions: {
            series: {
                color: '#e1e437',
            },
        },
        xAxis: {
            title: {
                text: 'Date',
            },
            type: 'datetime',

            // Use the date format in the
            // labels property of the chart
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat(
                        '%H:%M:%S',//'%A', //%a %d %b %Y',
                        this.value
                    );
                },
            },
        },
        yAxis: {
            title: {
                text: 'Average of the CO2 (Parts Per Million)',
            },
        },
        credits: {
            enabled: false,
        },
    });
    return chart;
}

// Create Pressure Chart
function createCOChart() {
    var chart = new Highcharts.Chart({
        chart: {
            renderTo: 'chart-co',
            //type: 'column'
            type: 'line',
        },
        series: [
            {
                lineWidth: 1, // Use a thin line width
                name: 'Room CO',
            },
        ],
        title: {
            text: undefined,
        },
        plotOptions: {
            series: {
                color: '#e91616',
            },
        },
        xAxis: {
            title: {
                text: 'Date',
            },
            type: 'datetime',

            // Use the date format in the
            // labels property of the chart
            labels: {
                formatter: function () {
                    return Highcharts.dateFormat(
                        '%H:%M:%S',//'%A', //%a %d %b %Y',
                        this.value
                    );
                },
            },
        },
        yAxis: {
            title: {
                text: 'Average of the CO (Parts Per Million)',
            },
        },
        credits: {
            enabled: false,
        },
    });
    return chart;
}
