'user strict';

var Logger = require('dw/system/Logger');
var helper = require('*/cartridge/scripts/helper/orderManagmentHelper.js');
var requestModel = require('*/cartridge/scripts/request/requestModel.js');
var omsService = require('*/cartridge/scripts/service/orderManagmentService.js');


var getAuthenticationToken = function (isExpired) {
    var tokenObj = helper.getSavedAuthToken();

    if (empty(tokenObj) || (tokenObj && empty(tokenObj.custom.token)) || isExpired) {
        var authService = omsService.getAuthService();
        var authPayload = requestModel.getAuthToken();

        try {
            var authResponse = authService.call(authPayload);
            if (authResponse.OK) {
                var accessToken = authResponse.object.access_token;
                helper.saveAuthToken(accessToken);
                return accessToken
            } else {
                Logger.error('(OrderManagmentAPI-getAuthenticationToken) -> Error occured while calling oms auth token in file:{0} at line:{1} and error is:{2}');
                return null;
            }
        } catch (e) {
            Logger.error('(OrderManagmentAPI-getAuthenticationToken) -> Error occured while calling oms auth token in file:{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
            return null;
        }
    } else {
        return tokenObj.custom.token;
    }
};

var orderManagmentRestApi = function (orderNumber, orderEmail) {
    var ProductMgr = require('dw/catalog/ProductMgr');
    var OrderMgr = require('dw/order/OrderMgr');
    var requestPayload = requestModel.getEligibalePayLoad(orderNumber, orderEmail);
    var accessToken;
    var restService;
    var parseServiceResponse;
    var restServiceResponse;
    var orderData = {};
    var lineItems = [];
    var paymentInstrument = {};

    try {
        accessToken = this.getAuthenticationToken(false);
        restService = omsService.getEligibilityService(accessToken);
        restServiceResponse = restService.call(requestPayload);

        if (restServiceResponse.error === 401) {
            accessToken = this.getAuthenticationToken(true);
            restService = omsService.getEligibilityService(accessToken);
            restServiceResponse = restService.call(requestPayload);
        }

        if (restServiceResponse.ok) {
            parseServiceResponse = JSON.parse(restServiceResponse.object);
            if (parseServiceResponse.totalSize > 0) {
                orderData.OrderSummary = parseServiceResponse.records[0].OrderSummary;
                orderData.OrderDeliveryGroupSummary = parseServiceResponse.records[0].OrderDeliveryGroupSummary;
                for (var i = 0; i < parseServiceResponse.totalSize; i++) {
                    var lineObj = parseServiceResponse.records[i];
                    product = ProductMgr.getProduct(lineObj.ProductCode);
                    var productImage = product.getImage('large');
                    productImage = productImage && productImage.httpsURL ? productImage.httpsURL.toString() : ''
                    lineObj.image = productImage;
                    lineItems.push(lineObj);

                }
                var order = OrderMgr.getOrder(orderData.OrderSummary.OrderNumber);
                paymentInstrument.cardType = order.paymentInstrument.creditCardType ? order.paymentInstrument.creditCardType : order.paymentInstrument.paymentMethod;
                paymentInstrument.numberLastDigits = order.paymentInstrument.creditCardNumberLastDigits;
                paymentInstrument.expirationMonth = order.paymentInstrument.creditCardExpirationMonth;
                paymentInstrument.expirationYear = order.paymentInstrument.creditCardExpirationYear;
                orderData.lineItems = lineItems;
                orderData.currency = order.currencyCode;
                orderData.paymentInstrument = paymentInstrument;
                orderData.response = true
            }
        }
    } catch (e) {
        Logger.error('(OrderManagmentAPI-orderManagmentRestApi) -> Error occured while calling oms auth token in file:{0} at line:{1} and error is:{2}', e.fileName, e.lineNumber, e.toString());
    }

    return orderData;
}

module.exports = {
    getAuthenticationToken: getAuthenticationToken,
    orderManagmentRestApi: orderManagmentRestApi
}