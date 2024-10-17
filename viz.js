// Example data
const histograms = {
    "2024-10-07 16:00:00": {
      bins: [10, 15, 20, 5], // Number of stocks in each bin
      minPrice: 100,
      maxPrice: 300,
      binSize: 50
    },
    "2024-10-07 15:30:00": {
      bins: [8, 12, 25, 10],
      minPrice: 100,
      maxPrice: 300,
      binSize: 50
    },
    // ... more timestamps
  };
  
  // Helper function to get timestamps
  function getTimestamps(histograms) {
    return Object.keys(histograms);
  }
  
  // Helper function to get bin edges
  function getBinEdges(histogram) {
    const { bins, minPrice, binSize } = histogram;
    return bins.map((_, i) => minPrice + i * binSize);
  }
  
  // Prepare data for Plotly
  const timestamps = getTimestamps(histograms);
  const binEdges = getBinEdges(histograms[timestamps[0]]); // Assume bin edges are same for all histograms
  
  // X-axis: Bin edges (stock price ranges)
  const x = binEdges;
  
  // Y-axis: Timestamps (each timestamp corresponds to a histogram)
  const y = timestamps;
  
  // Z-axis: Frequency of stock prices in each bin for each timestamp
  const z = y.map(timestamp => histograms[timestamp].bins);
  
  // Create the 3D plot
  const data = [
    {
      z: z,        // Z-axis: Frequencies of stocks in bins
      x: x,        // X-axis: Stock price bins
      y: y,        // Y-axis: Timestamps
      type: 'surface', // 3D surface plot
      colorscale: 'Viridis'  // Color theme for the surface
    }
  ];
  
  const layout = {
    title: '3D Histogram of Stock Prices Over Time',
    scene: {
      xaxis: { title: 'Stock Price Bins' },
      yaxis: { title: 'Timestamps' },
      zaxis: { title: 'Frequency' }
    }
  };
  
  // Plot the graph in a div element with id 'myDiv'
  Plotly.newPlot('myDiv', data, layout);

  
  