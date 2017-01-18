'use strict';
import "babel-polyfill";
import SiteMonitoring from './lookupService/index';

export default SiteMonitoring;

// this part is to ensure that 'SiteMonitoring' is exported as main entry class
module.exports = SiteMonitoring;
module.exports.SiteMonitoring = SiteMonitoring;
