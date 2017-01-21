
const SiteMonitoring = require('../lib/main');
let debug = true;
let siteMonitoring = new SiteMonitoring(debug); 

siteMonitoring.locateByAddress('31.13.74.00')
.then(result => {
    // result = { origin, destination }
    console.log('result', result);
  // origin = { region_code, latitude, longitude }
    console.log('origin', result.origin);
  // destination = [ { region_code, latitude, longitude } ]
    console.log('destination', result.destination);
});