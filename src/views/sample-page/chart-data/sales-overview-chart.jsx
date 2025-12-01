// ==============================|| DASHBOARD - SALES OVERVIEW CHART ||============================== //

const chartOptions = {
  chart: {
    type: 'line',
    height: 350,
    toolbar: { show: true },
    zoom: { enabled: true }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 3
  },
  grid: {
    row: {
      colors: ['transparent', 'transparent'],
      opacity: 0.5
    }
  },
  xaxis: {
    categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    labels: {
      formatter: function (val) {
        return '$' + val.toFixed(0);
      }
    }
  },
  legend: {
    show: true,
    fontFamily: 'Roboto, sans-serif',
    position: 'bottom',
    offsetX: 20,
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
  tooltip: {
    y: {
      formatter: function (val) {
        return '$' + val.toFixed(2);
      }
    }
  }
};

export default chartOptions;
