'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');
var UUIDUtils = require('dw/util/UUIDUtils');

exports.afterPOST = function (basket) {
    try {
        if (basket && basket.paymentInstrument && basket.paymentInstrument.creditCardToken) {
            var paypal = JSON.parse(basket.paymentInstrument.creditCardToken)
            var Transaction = require('dw/system/Transaction');
            Transaction.wrap(function () {
                basket.paymentInstrument.custom.paypalPayerID = paypal.payerID;
                basket.paymentInstrument.custom.paypalOrderID = paypal.orderID;
                basket.paymentInstrument.custom.paypalFacilitatorAccessToken = paypal.facilitatorAccessToken;
            });
        }
    } catch (ex) {
        Logger.error('(paymentInstruments) -> Error occured while executing Hook and exception is: {0} in {1} : {2}', ex.toString(), ex.fileName, ex.lineNumber);
    }

    return new Status(Status.OK);
};