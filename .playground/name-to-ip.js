/*jshint node:true, esnext:true */
/**
* @Author: mars
* @Date:   2017-01-12T17:47:12-05:00
* @Last modified by:   mars
* @Last modified time: 2017-01-16T00:52:52-05:00
*/
'use strict';

const dns = require('dns');

const Q = require('q');
const iplocation = require('iplocation');

const winston = require('winston');
const winstonDynamo = require("winston-dynamodb");

/*
Options:

accessKeyId: your AWS access key id
secretAccessKey: your AWS secret access key
region: the region where the domain is hosted
useEnvironment: use process.env values for AWS access, secret, & region.
tableName: DynamoDB table name

*/
process.env.AWS_ACCESS_KEY_ID = 'AKIAJJOGAFOBQ62FKWGA';
process.env.AWS_SECRET_ACCESS_KEY = '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';
process.env.AWS_REGION = 'us-east-1';

const options = {
  useEnvironment: true,
  tableName: 'clearonline-site-network',
  level: 'error'
};
const wDB = winstonDynamo.DynamoDB;
winston.add(winston.transports.DynamoDB, options);

const LOGGER = new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)({
      level: 'verbose',
      handleExceptions: true,
      json: true
    }),
    new (winston.transports.DynamoDB)(options)
  ]
});



const publicIp = require('public-ip');


// test
let domainName = 'www.google.com';
// let domainName = 'www.example.com';
// let domainName = 'www.github.com';

originLocation()
.then(location => {
  LOGGER.info('ORIGIN', location);

  return DomainToAddresses(domainName);
})
 .then(addresses => AddressesToLocation(addresses))
 .then(locationList => {
   LOGGER.info('DESTINATION', domainName, locationList);
 });




/**
 * @return { region_code } or null if error occured
 */
function originLocation() {
  return publicIp.v4().then(ip => AddressToLocation(ip))
  .catch(e => null);
}


/**
 * @param addresses Array<string>
 * @return Array<string>
 */
function AddressesToLocation(addresses) {

  return new Promise(resolve => {
    let outputList = [];
    Q.spawn(function *() {

      for (let i = 0; i < addresses.length; i++) {
        let address = addresses[i];
        let location = yield AddressToLocation(address);
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
function AddressToLocation(address) {
  return new Promise(resolve => {
    iplocation(address, (error, location) => {
      if (error) return resolve(null);
      return resolve(location);
    });

  });
}

/**
 * get at least one ip addresses bound to a domain name
 * we use dns.resolve4, then dns.resolve, then again dns.resolve4
 */
function DomainToAddresses(domainName) {
  return new Promise(resolve => {
    let outputList = [];
    Q.spawn(function *() {

      // dns.resolve4
      let addresses = yield NameToAddresses(domainName);
      outputList = outputList.concat(addresses);

      for (let i = 0; i < addresses.length; i++) {
        let address = addresses[i];
        // dns.resolve
        let names = yield AddressToNames(address);

        for (let j = 0; j < names.length; j++) {
          let name = names[j];
          // dns.resolve4
          let innerAddresses = yield NameToAddresses(name);
          outputList = outputList.concat(innerAddresses);

        }

      }

      return resolve(outputList);

    });
  });

}




/**
 * @param name the domain name
 * @return Array<string>
 */
function NameToAddresses(name) {
  return new Promise((resolve, reject) => {

    dns.resolve4(name, (err, addresses) => {

      if (err) return resolve([]);
      return resolve(addresses);

    });


  });
}

function AddressToNames(address) {
  return new Promise((resolve, reject) => {

    dns.reverse(address, (err, hostnames) => {

      if (err) return resolve([]);
      return resolve(hostnames);

    });


  });
}
