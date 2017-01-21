'use strict';
import winston from 'winston';


import dns from 'dns';

import Q from 'q';
import iplocation from 'iplocation';

export default class AddressLookup {
    constructor(debug){
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
     * @param address { string } ip (only v4 tested) address in the form xxx.xxx.xxx.xxx
     * @return { Array<string> } other connected ip addresses
     */
    search(address) {

        return new Promise(resolve => {
            let outputList = [];
            let alInstance = this;

            Q.spawn(function *() {

                // dns.resolve
                let names = yield alInstance.addressToNames(address);
                alInstance.LOGGER.debug('address lookup - search', names);

                for (let j = 0; j < names.length; j++) {
                    let name = names[j];
                    // dns.resolve4
                    let innerAddresses = yield alInstance.nameToAddresses(name);
                     
                    // input address should also be used if not mapped (by alInstance.nameToAddresses)
                    if(!innerAddresses.includes(address)) {
                        innerAddresses.push(address);
                    }
                    let locationList = yield alInstance.addressesToLocation(innerAddresses);
                    outputList = locationList;
                }

                return resolve(outputList);

            });
        });

    }

    /**
     * @param address { string }
     * @return { Array<string> } domain names that map to this ip
     */
    addressToNames(address) {
        return new Promise(resolve => {

            dns.reverse(address, (err, hostnames) => {

                if (err) {
                    this.LOGGER.error(err);
                    return resolve([]);
                } 

                let holder = [];
                hostnames.forEach(hostname => {
                    if(!holder.includes(hostname)){
                        holder.push(hostname);
                    }
                });
                this.LOGGER.debug('===========');
                this.LOGGER.debug(holder);
                this.LOGGER.debug('===========');
                return resolve(holder);

            });

        }).catch(e => []);
    }

    /**
     * @param name { string } domain name
     * @return { Array<string> } domain names that map to this ip
     */
    nameToAddresses(name) {

        return new Promise(resolve => {
            dns.resolve4(name, (err, addresses) => {

                if (err)  {
                    this.LOGGER.error(err);
                    return resolve([]);
                } 
                return resolve(addresses);

            });
        }).catch(e => []);

    }


    /**
     * @param addresses Array<string>
     * @return Array<string>
     */
    addressesToLocation(addresses) {

        return new Promise(resolve => {
            let outputList = [];
            let alInstance = this;
            Q.spawn(function *() {

                for (let i = 0; i < addresses.length; i++) {
                    let address = addresses[i];
                    let location = yield alInstance.addressToLocation(address);
                    outputList.push(location);
                }

                return resolve(outputList);

            });
        });

    }



    /**
     * @param address string ip address
     * @return { region_code, longitude, latitude }
     */
    addressToLocation(address) {
        return new Promise(resolve => {
            iplocation(address, (error, location) => {
                if (error)  {
                    this.LOGGER.error(error);
                    return resolve(null);
                } 
                return resolve(location);
            });

        }).catch(e => null);
    }

}