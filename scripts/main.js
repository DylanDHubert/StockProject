const axios = require('axios');
const fs = require('fs');

// API KEY FOR SCRAPING STOCK DATA
const API_KEY = 'B333XAEIW0ZNO74Q';
const stockSymbols = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA", "BRKB", "TSM", "CSCO",
    "CMCSA", "AMGN", "QCOM", "INTC", "ADBE", "AVGO", "NFLX", "PEP", "SBUX", "TXN",
    "AMAT", "COST", "REGN", "HON", "GILD", "BKNG", "MDLZ", "ISRG", "VRTX", "LRCX",
    "BIDU", "ADP", "PYPL", "SNPS", "CDNS", "MAR", "ORLY", "CSX", "MRVL", "WDAY",
    "NXPI", "FTNT", "CRWD", "KLAC", "MELI", "INTU", "DLTR", "PDD", "OKTA", "ZM",
    "SHOP", "TTWO", "RMD", "EXPE", "SPLK", "HPE", "WBA", "FISV", "CHKP", "CTSH",
    "ALGN", "SIRI", "NTRS", "ILMN", "ZBRA", "NDAQ", "VRSN", "MAR", "KEYS", "ANSS",
    "CDK", "DOV", "ADSK", "MCHP", "WDC", "ZUMZ", "DG", "RNG", "TTD"
];

const INTERVAL = '30min'; // TEMPORAL FREQUENCY
const TIME_SERIES_URL = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY'; // DATASET

// FETCH STOCK DATA
async function fetchStockData(symbol) {
    try {
        const url = `${TIME_SERIES_URL}&symbol=${symbol}&interval=${INTERVAL}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        console.log(data)

        // UNPACK RESPONSE DATA
        const timeSeries = data['Time Series (30min)'];

        if (!timeSeries) {
            console.warn(`No time series data for ${symbol}`);
            return [];
        }

        // GET LAST 48 (LAST DAY)
        const entries = Object.entries(timeSeries).slice(0, 48);

        // CALCULATE PERCENTAGE CHANGE
        return entries.map(([timestamp, values]) => {
            const open = parseFloat(values['1. open']);
            const close = parseFloat(values['4. close']);
            const percentChange = ((close - open) / open) * 100;

            return {
                timestamp,
                percentChange,
            };
        });
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return [];
    }
}

// FETCH DATA FOR MULTIPLE SYMBOLS
async function getStockDataForSymbols(symbols) {
    const stockData = {};

    for (let symbol of symbols) {
        const data = await fetchStockData(symbol);
        stockData[symbol] = data;
    }

    return stockData;
}

// GROUP STOCKS BY TIMESTAMP
function groupByTimestamp(stockData) {
    const groupedData = {};

    Object.keys(stockData).forEach(stockSymbol => {
        stockData[stockSymbol].forEach(({ timestamp, percentChange }) => {
            if (!groupedData[timestamp]) {
                groupedData[timestamp] = [];
            }
            groupedData[timestamp].push(percentChange);
        });
    });

    return groupedData;
}

// HISTOGRAM GENERATION
function createHistogram(percentChanges, binSize = 1) {
    const minChange = Math.min(...percentChanges);
    const maxChange = Math.max(...percentChanges);

    const numBins = Math.ceil((maxChange - minChange) / binSize);
    const bins = new Array(numBins).fill(0);

    percentChanges.forEach(change => {
        const binIndex = Math.floor((change - minChange) / binSize);
        bins[binIndex]++;
    });

    return {
        bins,
        minChange,
        maxChange,
        binSize
    };
}

function generateHistograms(stockData, binSize) {
    const groupedData = groupByTimestamp(stockData);

    const histograms = {};
    Object.keys(groupedData).forEach(timestamp => {
        const percentChanges = groupedData[timestamp];
        histograms[timestamp] = createHistogram(percentChanges, binSize);
    });

    return histograms;
}

// MAIN FUNCTION
(async () => {
    console.log('Fetching stock data...');
    const stockData = await getStockDataForSymbols(stockSymbols);

    console.log('Saving stock data to file...');
    fs.writeFileSync('data/stockData.json', JSON.stringify(stockData, null, 2));

    console.log('Generating histograms...');
    const histograms = generateHistograms(stockData, 1);

    console.log('Saving histograms to file...');
    fs.writeFileSync('data/histograms.json', JSON.stringify(histograms, null, 2));

    console.log('All data has been processed and saved.');
})();
