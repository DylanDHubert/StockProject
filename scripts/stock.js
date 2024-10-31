const axios = require('axios');
const fs = require('fs');

//API KEY FOR SCRAPING STOCK DATA
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

// GET STOCK DATA [SINGLE SYMBOL]
async function fetchStockData(symbol) {
    try {
        const url = `${TIME_SERIES_URL}&symbol=${symbol}&interval=${INTERVAL}&apikey=${API_KEY}`;
        const response = await axios.get(url);
        const data = response.data;

        // UNPACK RESPONSE DATA
        const timeSeries = data['Time Series (30min)'];

        // EXISTS?
        if (!timeSeries) {
            console.warn(`No time series data for ${symbol}`);
            return [];
        }

        // GET LAST 48 (LAST DAY)
        const entries = Object.entries(timeSeries).slice(0, 48);

        // MAP TIMESTAMP AND CLOSE
        const stockPrices = entries.map(([timestamp, values]) => {
            return {
                timestamp,
                close: values['4. close']
            };
        });

        return stockPrices;
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return [];
    }
}

// GET STOCK DATA [MULTI SYMBOL]
async function getStockDataForSymbols(symbols) {
    const stockData = {};

    for (let symbol of symbols) {
        const data = await fetchStockData(symbol);
        stockData[symbol] = data;
    }

    return stockData;
}

// MAIN
(async () => {
    const stockData = await getStockDataForSymbols(stockSymbols);
    
    // SAVE AS .JSON
    fs.writeFileSync('data/stockData.json', JSON.stringify(stockData, null, 2));

    console.log('Stock data has been saved to stockData.json');
})();
