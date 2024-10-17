const fs = require('fs');

// Helper function to group stock prices by timestamp
function groupByTimestamp(stockData) {
    const groupedData = {};

    // Loop through each stock
    Object.keys(stockData).forEach(stockSymbol => {
        stockData[stockSymbol].forEach(dataPoint => {
            const { timestamp, close } = dataPoint;
            if (!groupedData[timestamp]) {
                groupedData[timestamp] = [];
            }
            groupedData[timestamp].push(parseFloat(close));
        });
    });

    return groupedData;
}

// Helper function to create a histogram from stock prices
function createHistogram(stockPrices, binSize = 50) {
    const minPrice = Math.min(...stockPrices);
    const maxPrice = Math.max(...stockPrices);

    // Calculate the number of bins based on bin size
    const numBins = Math.ceil((maxPrice - minPrice) / binSize);
    const bins = new Array(numBins).fill(0);

    // Bin the stock prices
    stockPrices.forEach(price => {
        const binIndex = Math.floor((price - minPrice) / binSize);
        bins[binIndex]++;
    });

    return {
        bins,
        minPrice,
        maxPrice,
        binSize
    };
}

// Main function to process all timestamps and generate histograms
function generateHistograms(stockData, binSize) {
    const groupedData = groupByTimestamp(stockData);

    const histograms = {};

    Object.keys(groupedData).forEach(timestamp => {
        const stockPrices = groupedData[timestamp];
        const histogram = createHistogram(stockPrices, binSize);
        histograms[timestamp] = histogram;
    });

    return histograms;
}

// Read stock data from JSON file
fs.readFile('stockData.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading stock data:', err);
        return;
    }

    try {
        const stockData = JSON.parse(data);
        
        // Generate the histograms (using a bin size of 50 as an example)
        const histograms = generateHistograms(stockData, 50);
        
        // Output the histograms for each timestamp
        console.log(histograms);
        
        // Save histograms to a JSON file
        fs.writeFile('histograms.json', JSON.stringify(histograms, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing histograms to file:', writeErr);
            } else {
                console.log('Histograms saved to histograms.json');
            }
        });
    } catch (parseError) {
        console.error('Error parsing stock data:', parseError);
    }
});
