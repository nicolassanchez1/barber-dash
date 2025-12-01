// ==============================|| DASHBOARD - CATEGORY DISTRIBUTION CHART ||============================== //

const chartOptions = {
  chart: {
    type: 'pie',
    height: 350,
    toolbar: { show: false }
  },
  labels: ['Whisky', 'Ron', 'Vodka', 'Tequila', 'Gin', 'Licores'],
  legend: {
    show: true,
    fontFamily: 'Roboto, sans-serif',
    position: 'bottom',
    offsetX: 10,
    labels: {
      useSeriesColors: false
    },
    markers: {
      size: 8,
      shape: 'circle'
    },
    itemMargin: {
      horizontal: 15,
      vertical: 8
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(1) + '%';
    }
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return val.toFixed(1) + '%';
      }
    }
  },
  plotOptions: {
    pie: {
      expandOnClick: false,
      donut: {
        size: '65%',
        labels: {
          show: true,
          name: {
            show: true
          },
          value: {
            show: true,
            formatter: function (val) {
              return val.toFixed(1) + '%';
            }
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function (w) {
              return '100%';
            }
          }
        }
      }
    }
  }
};

export default chartOptions;
