// ==============================|| DASHBOARD - BEST SELLING PRODUCTS CHART ||============================== //

const chartOptions = {
  chart: {
    type: 'bar',
    height: 350,
    toolbar: { show: true },
    zoom: { enabled: true }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      columnWidth: '55%',
      borderRadius: 4
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Ron Añejo', 'Whisky Escocés', 'Vodka Premium', 'Tequila Reposado', 'Gin London Dry'],
  },
  fill: { type: 'solid' },
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
      shape: 'square'
    },
    itemMargin: {
      horizontal: 15,
      vertical: 8
    }
  },
  grid: { show: true }
};

export default chartOptions;
