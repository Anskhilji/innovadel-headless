'use strict';

var CustomObjectMgr = require('dw/object/CustomObjectMgr');
var Transaction = require('dw/system/Transaction');
var Logger = require('dw/system/Logger');
var Constant = require('*/cartridge/scripts/utils/constant.js');

var getSavedAuthToken = function () {
    var accessToken = CustomObjectMgr.getCustomObject(Constant.OMS_ACCESS_TOKEN_ID, Constant.OMS_ACCESS_TOKEN);

    if (!empty(accessToken) && !empty(accessToken.custom.token)) {
        return accessToken;
    }
    return null;
}

var saveAuthToken = function (accessToken) {
    var existingToken = this.getSavedAuthToken();
    try {
        if (existingToken) {
            Transaction.wrap(function () {
                existingToken.custom.token = accessToken;
            })
        } else {
            var newAccessToken = CustomObjectMgr.createCustomObject(Constant.OMS_ACCESS_TOKEN, Constant.OMS_ACCESS_TOKEN_ID);
            return newAccessToken;
        }
    } catch (e) {
        Logger.error('(OMSAPI-saveAuthToken) -> Error occured while calling oms auth token in file:{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
    }
}

module.exports = {
    getSavedAuthToken: getSavedAuthToken,
    saveAuthToken: saveAuthToken
}