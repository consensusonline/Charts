(function() {
  'use strict';
  angular.module('app').controller('ChartController', ChartController);

  ChartController.$inject = ['$http', '$q'];
  function ChartController($http, $q){
    var vm = this;
    var config = {
      header: "Score board",
      backgroundColor: "#009FDA",
      database: "http://192.168.8.7:8000/api/leaderboard/",
      textColor: '#FFFFFF'
    };
    var pieChart;
    var pieOptions = {
      //Boolean - Whether we should show a stroke on each segment
      segmentShowStroke : false,

      //String - The colour of each segment stroke
      segmentStrokeColor : "#fff",

      //Number - The width of each segment stroke
      segmentStrokeWidth : 0,

      //Number - The percentage of the chart that we cut out of the middle
      percentageInnerCutout : 0, // This is 0 for Pie charts

      //Number - Amount of animation steps
      animationSteps : 100,

      //String - Animation easing effect
      animationEasing : "easeOutBounce",

      //Boolean - Whether we animate the rotation of the Doughnut
      animateRotate : true,

      //Boolean - Whether we animate scaling the Doughnut from the centre
      animateScale : true,

      //String - A legend template
      legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    };
    vm.header = config.header;
    vm.background = config.backgroundColor;
    vm.textColor = config.textColor;
    vm.chartData = [];


    init();
    function init() {
      $http.get('config.json')
        .then(function (result) {
          config = result.data;
        },function (error){
           return $q.reject(error);
      });
      drawChart();
      setInterval(reDrawChart, 10000);
    }

    function reDrawChart() {
      getData()
        .then(function (data) {
          var mappedData = mapData(data.leaderboard)
          vm.chartData = mappedData;
          _.forEach(pieChart.segments, function (seq) {
            _.forEach(vm.chartData, function (charEle) {
              if(seq.label == charEle.label){
                seq.value = charEle.value;
              }
            })
          });
          pieChart.update();
        })
    }

    function drawChart() {
      getData()
        .then(function (data) {
          var mappedData = mapData(data.leaderboard)
          vm.chartData = mappedData;
          showGraph(mappedData);
          showLegend();
        });
    }

    function getData() {
      return $http.get('http://192.168.8.7:8000/api/leaderboard/')
        .then(function (result) {
          return result.data;
        },function (error){
           return $q.reject(error);
        });
    }


    function mapData(data) {
      var mappedData = [];
      _.forIn(data, function(ele) {
        mappedData.push({
          value: ele.score,
          color: ele.colour,
          label: ele.displayName ? ele.displayName : "Anon"
        });
      });
      return mappedData;
    }



    function showGraph(data){
      var expenses = document.getElementById("myChart").getContext("2d");
      pieChart = new Chart(expenses).Pie(data, pieOptions);
    }

    function showLegend() {
      var legendHolder = document.createElement('div');
      legendHolder.innerHTML = pieChart.generateLegend();
      document.getElementById('legend').appendChild(legendHolder.firstChild);
    }

  };
})();
