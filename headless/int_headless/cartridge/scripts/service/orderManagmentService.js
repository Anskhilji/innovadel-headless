'user strict';


var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
var Logger = require('dw/system/Logger');
var constant = require('*/cartridge/scripts/utils/constant.js');

function getAuthServiceConfigs() {
    var serviceConfig = {
        createRequest: function (svc, args) {
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.setRequestMethod('POST');
            return args;
        },
        parseResponse: function (svc, client) {
            return JSON.parse(client.text);
        },
        filterLogMessage: function (message) {
            return message;
        },
        getRequestLogMessage: function (serviceRequest) {
            return serviceRequest;
        },
        getResponseLogMessage: function (serviceResponse) {
            if (serviceResponse.errorText) {
                Logger.error('(oms-getAuthServiceConfigs) -> Error occurred while calling REST API {0}: {1} ({2})', serviceResponse.statusCode, serviceResponse.statusMessage, serviceResponse.errorText);
            }
            return serviceResponse;
        }
    };
    return serviceConfig;
}

var getAuthService = function () {
    var authorizationService = LocalServiceRegistry.createService(constant.SERVICE_ID.OMS_AUTH, getAuthServiceConfigs());
    return authorizationService;
}

var getEligibilityServiceConfig = function (accessToken) {
    var serviceConfig = {
        createRequest : function (svc, args) {
            svc.addHeader ('Content-Type', 'application/json');
            svc.addHeader ('Authorization', 'Bearer ' + accessToken);
            svc.setRequestMethod('GET');
            svc.URL = svc.configuration.credential.URL + args;
            return args;
        },
        parseResponse : function (svc, client) {
           return client.text;
        },
        filterLogMessage : function (message) {
           return message;
        },
        getRequestLogMessage : function (serviceRequest) {
            return serviceRequest.text;
        },
        getResponseLogMessage : function (serviceResponse) {
            if(serviceResponse.errorText) {
                Logger.error('(OrderManagmentService-getEligibilityServiceConfig) -> Error occurred while calling REST API {0}: {1} ({2})', serviceResponse.statusCode, serviceResponse.statusMessage, serviceResponse.errorText);
            }
            return serviceResponse.text;
        }
    };
    return serviceConfig;
}

var getEligibilityService = function (accessToken) {
    var eligiableService = '';
    try {
        eligiableService = LocalServiceRegistry.createService(constant.SERVICE_ID.OMS_REST, getEligibilityServiceConfig(accessToken));
    } catch (e) {
        Logger.error('(OrderManagmentService-getEligibilityService) -> Error occurred while calling REST API {0}: {1} ({2})', e.fileName, e.lineNumber, e.toString());
    }
    return eligiableService;
}

module.exports =  {
    getAuthService :getAuthService,
    getEligibilityService: getEligibilityService
}