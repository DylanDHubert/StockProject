const fs = require('fs');

// GROUP STOCKS BY TIMESTAMP
function groupByTimestamp(stockData) {
    const groupedData = {};

    // FOR EACH STOCK
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

// HISTOGRAM GENErATION
function createHistogram(stockPrices, binSize = 50) {
    const minPrice = Math.min(...stockPrices);
    const maxPrice = Math.max(...stockPrices);

    // BINS
    const numBins = Math.ceil((maxPrice - minPrice) / binSize);
    const bins = new Array(numBins).fill(0);

    // PRICES FOR BINS
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

// MAIN
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

// SAVE AS .JSON FILE
fs.readFile('stockData.json', 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading stock data:', err);
        return;
    }

    try {
        const stockData = JSON.parse(data);
        
        // MAKE HISTOGRAMS WITH 50 BINS
        const histograms = generateHistograms(stockData, 50);
        
        // PRINT HISTOGRAMS
        console.log(histograms);
        
        // SAVE
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
