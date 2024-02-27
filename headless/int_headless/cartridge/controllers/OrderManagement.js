'use strict'

// OrderStatus-TrackOrder : This endpoint is invoked to get Order Status from OMS.
var server = require('server');

server.get('TrackOrder', function(req, res, next) {
    var omsAPI = require('*/cartridge/scripts/api/orderManagmentAPI.js');
    var orderNumber = request.httpParameterMap.orderNumber.stringValue;
    var orderEmail = request.httpParameterMap.orderEmail.stringValue;
    var responseData = omsAPI.orderManagmentRestApi(orderNumber, orderEmail);
    var omsResponse = {};
    res.setContentType('application/json');
    res.setHttpHeader('Access-Control-Allow-Origin', '*');

    if (responseData.response) {
        omsResponse.responseData = responseData;
        omsResponse.statusCode = 200;
    } else {
        omsResponse.responseData = "Order not found" ;
        omsResponse.statusCode = 404;
    }

    res.json({
        omsResponse
    })
    next();
});

module.exports = server.exports();