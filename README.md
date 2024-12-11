PACKAGES:
`
npm install axios express
`

GENERATE NECESSARY DATA: 
`
node scripts/main.js
`

RUN SERVER:
`
python -m http.server PORT
`

VIEW AT:
`
http://localhost:PORT/
`

`
GOOGLEFINANCE
`


FILES & DOCUMENTATION:

     /SCRIPTS/MAIN.js
   
      Fetches Stock Data (Saves as `stock.json` in /DATA)
      Constructs Histograms Per Timestamp of Close Value (Saves as `histograms.json` in /DATA)
      
      /SCRIPTS/VIZ.js

      Makes 3D p5.js Visualization to be Rendered in `index.html` on localhost:PORT
      
      /INDEX.html

      Simple Client Setup for Viz.js

      
    
