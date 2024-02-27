'use strict';
var Logger = require('dw/system/Logger');
var omsAPI = require('*/cartridge/scripts/api/orderManagmentAPI.js');

exports.modifyGETResponse = function (order, apiOrder) {
    if (!empty(order)) {
        try {
            var responseData = omsAPI.orderManagmentRestApi(order.orderNo, order.customerEmail);
            apiOrder.c_orderData = responseData;
        } catch (e) {
            Logger.error('(order-afterPOST) -> Error occured while calling oms auth token in file:{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
            return null;
        }
    }
}