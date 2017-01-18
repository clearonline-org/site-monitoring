'use strict';


import winston from 'winston';

import publicIp from 'public-ip';

import AddressLookup from './address-lookup';
import DomainLookup from './domain-lookup';

export default class SiteMonitoring {
    constructor(debug){
        this.addressLookup = new AddressLookup(debug);
        this.domainLookup = new DomainLookup(debug);

        this.LOGGER = new winston.Logger();
        if(!!debug) {
            this.initializeLogger();
        }

    }
    initializeLogger() {
        this.LOGGER = new winston.Logger({
            level: 'debug',
            transports: [
                new (winston.transports.Console)({
                    level: 'debug',
                    handleExceptions: true,
                    json: true
                })
            ]
        });
    }

    /**
     * find out the location info of the computer running this code
     */
    locateOrigin() {
        return publicIp.v4().then(ip => this.addressLookup.addressToLocation(ip));
    }

    /**
     * @return { origin, destination }
     */
    locateByDomain(domainName) {

        let origin = null;
        let destination = [];
        let result = { origin, destination };

        return this.locateOrigin()
        .then(origin => {
            result.origin = origin;
            return this.domainLookup.search(domainName);
        })
        .then(destination => {
            result.destination = destination;            
            return result;
        })
        .catch(e => {
            this.LOGGER.error(e);
            return result;
        });


    }

    /**
     * @return { origin, destination }
     */
    locateByAddress(address) {
        
        let origin = null;
        let destination = [];
        let result = { origin, destination };
        this.LOGGER.debug(address);           

        return this.locateOrigin()
        .then(origin => {
        this.LOGGER.debug('index.locateByAddress - origin', origin);           
            result.origin = origin;
            return this.addressLookup.search(address);
        })
        .then(destination => {
        this.LOGGER.debug('index.locateByAddress - destination', destination);           
            result.destination = destination;            
            return result;
        })
        .catch(e => {
            this.LOGGER.error('index.locateByAddress - e', e);            
            return result;
        });

    }

}

// export { SiteMonitoring };
