
const SiteMonitoring = require('../lib/main');
let debug = false;
let siteMonitoring = new SiteMonitoring(debug); 

siteMonitoring.locateIp('31.13.74.00')
.then(result => {
    // result = { longitude, latitude ... }
    console.log('result', result);
  // origin = { region_code, latitude, longitude }
    console.log('origin', result.longitude);
  // destination = [ { region_code, latitude, longitude } ]
    console.log('destination', result.latitude);
});