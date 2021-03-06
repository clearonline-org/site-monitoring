	'use strict';

/**
 * 
 */
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000; // 10 second timeout

const SiteMonitoring = require('../lib/main');
const publicIp = require('public-ip');

/**
 * i chose to use facebook because the idea of writting this piece of code 
 * came from the struggle i went through while testing my facebook bot
 * running on AWS Lambda, using claudiajs.
 * for every single message from facebook, the bot sent more than one answer
 * and i could not figure out why that was happening
 */
const testDomainName = 'facebook.com';

describe('Lookup server location by domain', () => {
    /**
     * call locateByDomain to get its location information
     */
    it('finds the server running the code', () => {
        let debug = true;
        let siteMonitoring = new SiteMonitoring(debug); 

        return siteMonitoring.locateByDomain(testDomainName)
        .then(result => {
            // result = { origin, destination }
            expect(result).toBeDefined();
            // origin = { region_code, latitude, longitude }
            expect(result.origin).toBeDefined();
            // destination = [ { region_code, latitude, longitude } ]
           return expect(result.destination).toBeInstanceOf(Array);

        });
    });
});