/**
 * 
 */

const SiteMonitoring = require('../index');
const publicIp = require('public-ip');

describe('Lookup server location by address', () => {
    it('Create instance', () => {
        let siteMonitoring = new SiteMonitoring(); 
        expect(siteMonitoring).toBeInstanceOf(SiteMonitoring);
    });

    /**
     * get running server ip 
     * call locateByAddress to get its location information
     */
    it('finds the server running the code', () => {
        let debug = true;
        let siteMonitoring = new SiteMonitoring(debug); 

        return publicIp.v4().then(ip => siteMonitoring.locateByAddress(ip))
        .then(result => {
            // result = { origin, destination }
            expect(result).toBeDefined();
            // origin = { region_code, latitude, longitude }
            expect(result.origin).toBeDefined();
            // destination = [ { region_code, latitude, longitude } ]
            expect(result.destination).toBeInstanceOf(Array);

        });
    });
});