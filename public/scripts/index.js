// DOM elements
const loginElement = document.querySelector('#login-form');
const contentElement = document.querySelector('#content-sign-in');
const userDetailsElement = document.querySelector('#user-details');
const authBarElement = document.querySelector('#authentication-bar');
const deleteButtonElement = document.getElementById('delete-button');
const deleteModalElement = document.getElementById('delete-modal');
const deleteDataFormElement = document.querySelector('#delete-data-form');
const viewDataButtonElement = document.getElementById('view-data-button');
const hideDataButtonElement = document.getElementById('hide-data-button');
//const tableContainerElement = document.querySelector('#table-container');
//const chartsRangeInputElement = document.getElementById('charts-range');
const loadDataButtonElement = document.getElementById('load-data');
const cardsCheckboxElement = document.querySelector('input[name=cards-checkbox]');
const gaugesCheckboxElement = document.querySelector('input[name=gauges-checkbox]');
//const chartsCheckboxElement = document.querySelector('input[name=charts-checkbox]');
const dropdownElement = document.querySelector('#device-select');
const sensordropdownElement = document.querySelector('#sensor-select');
const timedropdownElement = document.querySelector('#time-select');
const tableElement = document.querySelector('#tbody');

// DOM elements for sensor readings
const cardsReadingsElement = document.querySelector('#cards-div');
const gaugesReadingsElement = document.querySelector('#gauges-div');
//const chartsDivElement = document.querySelector('#charts-div');
const tempElement = document.getElementById('temp');
const humElement = document.getElementById('hum');
const co2Element = document.getElementById('co2');
const coElement = document.getElementById('co');
const updateElement = document.getElementById('lastUpdate');
const timeupdateElement = document.getElementById('currenttimeUpdate');
const time2updateElement = document.getElementById('7dateagoUpdate');
const nameupdateElement = document.getElementById('nameUpdate');
const nowtimeupdateElement = document.getElementById('nowcurrenttimeUpdate');
// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime) {
  return new Date(epochTime * 1000);
}
// convert time to human-readable format YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime) {
  var epochDate = new Date(epochToJsDate(epochTime));
  var dateTime =
      epochDate.getFullYear() +
      '/' +
      ('00' + (epochDate.getMonth() + 1)).slice(-2) +
      '/' +
      ('00' + epochDate.getDate()).slice(-2) +
      ' ' +
      ('00' + epochDate.getHours()).slice(-2) +
      ':' +
      ('00' + epochDate.getMinutes()).slice(-2) +
      ':' +
      ('00' + epochDate.getSeconds()).slice(-2);

  return dateTime;
}

dropdownElement.addEventListener('change', e => {
  try {
      auth.onAuthStateChanged(user => {
          if (user) {
              setupUI(user);
          } else {
              setupUI();
          }
      });
  } catch (e) {
      console.log(e);
  }
});


timedropdownElement.addEventListener('change', e => {
    try {
        auth.onAuthStateChanged(user => {
            if (user) {
                setupUI(user);
            } else {
                setupUI();
            }
        });
    } catch (e) {
        console.log(e);
    }
});

/*sensordropdownElement.addEventListener('change', e => {
    try {
        auth.onAuthStateChanged(user => {
            if (user) {
                setupUI(user);
            } else {
                setupUI();
            }
        });
    } catch (e) {
        console.log(e);
    }
});*/

// MANAGE LOGIN/LOGOUT UI
var setupUI = user => {
  if (user) {
      //toggle UI elements
      loginElement.style.display = 'none';
      contentElement.style.display = 'block';
      authBarElement.style.display = 'block';
      userDetailsElement.style.display = 'block';
      userDetailsElement.innerHTML = user.email;

      // get user UID to get data from database
      var uid = user.uid;
      // console.log(uid);

      const deviceId = dropdownElement.value;
      //const devicetext = dropdownElement.text;

      document.getElementById('demo').innerHTML = deviceId;
      // Database paths (with user UID)

      const dbPath = `UsersData/${uid.toString()}/${deviceId.toString()}`;
      // var chartPath = 'UsersData/' + uid.toString() + '/charts/range';
 
      // Database references
      var dbRef = firebase.database().ref(dbPath);
      const timevalue = timedropdownElement.value;
      const currentDate = new Date();
      const time = currentDate.getTime()+(5.5 * 60 * 60 * 1000);
      const weekAgoTimestamp = time - (Number(timevalue) * 60 * 60 * 1000);
      timeupdateElement.innerHTML = epochToDateTime((time-(5.5 * 60 * 60 * 1000))/1000);
      time2updateElement.innerHTML = epochToDateTime((weekAgoTimestamp-(5.5 * 60 * 60 * 1000))/1000);
    
      // Retrieve the data for today only
      var data = [];

      dbRef.once("value", function(snapshot) {
           snapshot.forEach(function(dataSnapshot) {
               var timestamp = Number(((dataSnapshot.child("timestamp").val()) * 1000)+(5.5 * 60 * 60 * 1000));
               if (timestamp >= weekAgoTimestamp && timestamp <= time) {
                 var co = Number(dataSnapshot.child("co").val());
                 var temperature = Number(dataSnapshot.child("temperature").val());
                 var co2 = Number(dataSnapshot.child("co2").val());
                 var humidity = Number(dataSnapshot.child("humidity").val());
                 data.push([timestamp, co, temperature, co2, humidity]);
               }
             });
             
             //  });
      //const sensorId = sensordropdownElement.value;
      //const sensorname = sensordropdownElement.text;
     // const sensorname = $("#sensor-select option:selected").text();
      const sensortime = $("#time-select option:selected").text();
      //const devicetext = sensordropdownElement.text;
     // document.getElementById('demo1').innerHTML = sensorname;
      // Create the chart once all the data is loaded
    //  dbRef.once("value", function(snapshot) {
          var charttemperature = Highcharts.chart("chart-temperature", {
              chart: {
                type: "line"
              },
              title: {
                  text: "Temperature in the  " + sensortime
              },
              xAxis: {
                  type: "datetime"
              },
              yAxis: {
                  title: {
                      text: "Temperature Celsius Degrees"
                  },
                  plotBands: [/*{
                    color: "rgba(30, 228, 9, 0.52)",
                    from: 0,
                    to: 600,
                    label: {
                      text: "Excellent"
                    }
                  },
                  {
                    color: "rgba(79, 241, 10, 0.49)",
                    from: 600,
                    to: 800,
                    label: {
                      text: "Good"
                    }
                  },
                  {
                    color: "rgba(139, 245, 8, 0.49)",
                    from: 800,
                    to: 1000,
                    label: {
                      text: "Fair"
                    }
                  },
                  {
                    color: "rgba(255, 226, 0, 0.49)",
                    from: 1000,
                    to: 1500,
                    label: {
                      text: "Mediocre"
                    }
                  },*/
                  {
                    color: "rgba(255, 4, 4, 0.13)",
                    from: 40,
                    to: 50,
                    label: {
                      text: "Bad"
                    }
                  },
                /*  {
                    color: "rgba(255, 0, 8, 0.78)",
                    from: 2000,
                    to: 2500,
                    label: {
                      text: "Very Bad"
                    }
                  },*/
                ]
              },
              series: [{
                  name: "Room Temperature",
                  color: '#16e7cb',
                  data: data.map(function(point) {
                      return [point[0], point[2]]; // temperature is the third element in each data point
                  })
              }]

          });

          var charthumidity = Highcharts.chart("chart-humidity", {
            chart: {
              type: "line"
            },
            title: {
                text: "Humidity in the  " + sensortime
            },
            xAxis: {
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: "Humidity (%)"
                }
            },
            series: [{
                name: "Room Humidity",
                color: '#e91616',
                data: data.map(function(point) {
                    return [point[0], point[4]]; // temperature is the third element in each data point
                })
            }]

          });

          var chartco2 = Highcharts.chart("chart-co2", {
            chart: {
              type: "line"
            },
            title: {
                text: "CO2 in the  " + sensortime
            },
            xAxis: {
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: "CO2 (ppm)"
                },
                plotBands: [/*{
                    color: "rgba(30, 228, 9, 0.52)",
                    from: 0,
                    to: 600,
                    label: {
                      text: "Excellent"
                    }
                  },
                  {
                    color: "rgba(79, 241, 10, 0.49)",
                    from: 600,
                    to: 800,
                    label: {
                      text: "Good"
                    }
                  },
                  {
                    color: "rgba(139, 245, 8, 0.49)",
                    from: 800,
                    to: 1000,
                    label: {
                      text: "Fair"
                    }
                  },
                  {
                    color: "rgba(255, 226, 0, 0.49)",
                    from: 1000,
                    to: 1500,
                    label: {
                      text: "Mediocre"
                    }
                  },*/
                  {
                    color: "rgba(255, 4, 4, 0.13)",
                    from: 1500,
                    to: 2500,
                    label: {
                      text: "Bad"
                    }
                  },
                /*  {
                    color: "rgba(255, 0, 8, 0.78)",
                    from: 2000,
                    to: 2500,
                    label: {
                      text: "Very Bad"
                    }
                  },*/
                ]
            },
            series: [{
                name: "Room CO2",
                color: '#193036',
                data: data.map(function(point) {
                    return [point[0], point[3]]; // temperature is the third element in each data point
                })
            }]

          });

          var chartco = Highcharts.chart("chart-co", {
            chart: {
              type: "line"
            },
            title: {
                text: "CO in the  " + sensortime
            },
            xAxis: {
                type: "datetime"
            },
            yAxis: {
                title: {
                    text: "CO (ppm)"
                },
                plotBands: [/*{
                    color: "rgba(30, 228, 9, 0.52)",
                    from: 0,
                    to: 600,
                    label: {
                      text: "Excellent"
                    }
                  },
                  {
                    color: "rgba(79, 241, 10, 0.49)",
                    from: 600,
                    to: 800,
                    label: {
                      text: "Good"
                    }
                  },
                  {
                    color: "rgba(139, 245, 8, 0.49)",
                    from: 800,
                    to: 1000,
                    label: {
                      text: "Fair"
                    }
                  },
                  {
                    color: "rgba(255, 226, 0, 0.49)",
                    from: 1000,
                    to: 1500,
                    label: {
                      text: "Mediocre"
                    }
                  },*/
                  {
                    color: "rgba(255, 4, 4, 0.13)",
                    from: 1800,
                    to: 4000,
                    label: {
                      text: "Bad"
                    }
                  },
                  /*{
                    color: "rgba(255, 0, 8, 0.78)",
                    from: 1800,
                    to: 4000,
                    label: {
                      text: "Very Bad"
                    }
                  },*/
                ]
            },
            series: [{
                name: "Room CO",
                color: '#800080',
                data: data.map(function(point) {
                    return [point[0], point[1]]; // temperature is the third element in each data point
                })
            }]

          });
          return charttemperature,charthumidity,chartco2,chartco;
      });
 
      dbRef.orderByKey().limitToLast(1).on(
          'value',
          querySnapshot => {


              const queryData = [];

              querySnapshot.forEach(function (item) {
                  const jsonData = item.val();
                  queryData.push(jsonData);
              });

              const averageData = queryData;

             averageData.forEach(function (jsonData) {
                  // Save values on variables
                  var temperature = jsonData.temperature;
                  var humidity = jsonData.humidity;
                  var co2 = jsonData.co2;
                  var co = jsonData.co;
                  var timestamp = jsonData.timestamp;

                  updateElement.innerHTML = epochToDateTime(timestamp);

                  tempElement.innerHTML = temperature;
                  humElement.innerHTML = humidity;
                  co2Element.innerHTML = co2;
                  coElement.innerHTML = co;
                 
                  var gaugeT = createTemperatureGauge();
                  var gaugeH = createHumidityGauge();
                  gaugeT.draw();
                  gaugeH.draw();
                  gaugeT.value = temperature;
                  gaugeH.value = humidity;
                //  updateElement.innerHTML = epochToDateTime1(timestamp);
              });
          },
          error => {
              console.log('Error getting documents: ', error);
          }
      );
      //CHECKBOXES
      // Checbox (cards for sensor readings)
      cardsCheckboxElement.addEventListener('change', e => {
          if (cardsCheckboxElement.checked) {
              cardsReadingsElement.style.display = 'block';
          } else {
              cardsReadingsElement.style.display = 'none';
          }
      });
      // Checbox (gauges for sensor readings)
      gaugesCheckboxElement.addEventListener('change', e => {
          if (gaugesCheckboxElement.checked) {
              gaugesReadingsElement.style.display = 'block';
          } else {
              gaugesReadingsElement.style.display = 'none';
          }
      });

      // IF USER IS LOGGED OUT
  } else {
      // toggle UI elements
      loginElement.style.display = 'block';
      authBarElement.style.display = 'none';
      userDetailsElement.style.display = 'none';
      contentElement.style.display = 'none';
  }
};
