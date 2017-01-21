'use strict';

/**
 * 
 */

const SiteMonitoring = require('../lib/main');
const publicIp = require('public-ip');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 second timeout

describe('Lookup server location by address', () => {

    /**
     * get running server ip 
     * call locateByAddress to get its location information
     */
    it('finds the server running the code', () => {
        let debug = true;
        let siteMonitoring = new SiteMonitoring(debug); 

        return publicIp.v4().then(ip => siteMonitoring.locateIp(ip))
        // return siteMonitoring.locateByAddress(ip)
        .then(result => {
            // result = { region_code, latitude, longitude ... }
            console.log('result', result);
            expect(result).toBeDefined();
            expect(result.latitude).toBeDefined();
            return expect(result.latitude).toBeDefined();

        });
    });
});