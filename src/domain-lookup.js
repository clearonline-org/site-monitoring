const winston = require('winston');

const Q = require('q');

const AddressLookup = require('./address-lookup');

class DomainLookup {
    constructor(debug) {
        this.addressLookup = new AddressLookup(debug);
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
      * 
     * @param domainName { string }
     * @return { Array<string> } other connected ip addresses
     */
    search(domainName) {
        let addressList = []; // here we make sure all ip addresses found are used
        return this.addressLookup.nameToAddresses(domainName) // nameToAddresses
        .then(addresses => { 
            addressList = addressList.concat(addresses); 
            return this.addressesToName(addresses);
        })
        .then(names => this.namesToAddress(names))
        .then(addresses => {
            addresses.forEach(address => {
                if(!addressList.find(a => a === address)) {
                    addressList.push(address);
                }
            });
            return this.addressLookup.addressesToLocation(addressList);
        })
        .catch(e => {
            this.LOGGER.error(e);
            return [];
        });
    }

    /**
     * @return { Array<string> } list of domain names
     */
    addressesToName(addresses) {

        return new Promise(resolve => {
            let outputList = [];
            let dlInstance = this;
            Q.spawn(function *() {
                
                dlInstance.LOGGER.debug('===========');
                dlInstance.LOGGER.debug(addresses);
                dlInstance.LOGGER.debug('===========');

                for (let i = 0; i < addresses.length; i++) {
                    let address = addresses[i];
                    let names = yield dlInstance.addressLookup.addressToNames(address);
                    outputList = outputList.concat(names);
                }

                return resolve(outputList);

            });
        });

    }
    /**
     * @return { Array<string> } list of ip addresses
     */
    namesToAddress(names) {

        return new Promise(resolve => {
            let outputList = [];
            let dlInstance = this;
            Q.spawn(function *() {

                for (let i = 0; i < names.length; i++) {
                    let name = names[i];
                    
                    let addresses = yield dlInstance.addressLookup.nameToAddresses(name);
                    outputList = outputList.concat(addresses);

                }

                return resolve(outputList);

            });
        });

    }
}
module.exports = DomainLookup;
