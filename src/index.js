'use strict';

const winston = require('winston');

const publicIp = require('public-ip');

const AddressLookup = require('./address-lookup');
const DomainLookup = require('./domain-lookup');

class SiteMonitoring {
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
            level: 'verbose',
            transports: [
                new (winston.transports.Console)({
                    level: 'verbose',
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

        return this.locateOrigin()
        .then(origin => {
            result.origin = origin;
            return this.addressLookup.search(address);
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

}

module.exports = SiteMonitoring;
