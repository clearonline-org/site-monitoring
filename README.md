<!--
@Author: mars
@Date:   2017-01-15T18:29:14-05:00
@Last modified by:   mars
@Last modified time: 2017-01-16T00:49:34-05:00
-->
# site-monitoring
Where is this request coming from?

### Exposed methods
* locateByDomain
```javascript
const SiteMonitoring = require('site-monitoring');
let debug = false;
let siteMonitoring = new SiteMonitoring(debug); 

siteMonitoring.locateByDomain('www.example.com')
.then({ origin, destination } => {
    // origin = { region_code, latitude, longitude }
    // destination = [ { region_code, latitude, longitude } ]
});

```
* locateByAddress
```javascript
const SiteMonitoring = require('site-monitoring');
let debug = false;
let siteMonitoring = new SiteMonitoring(debug);

siteMonitoring.locateByAddress('111.111.111.111')
.then({ origin, destination } => {
  // origin = { region_code, latitude, longitude }
  // destination = [ { region_code, latitude, longitude } ]
});
```


