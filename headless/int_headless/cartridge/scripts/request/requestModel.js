'use strict';
var Constant = require('*/cartridge/scripts/utils/constant');

var getAuthToken = function () {
    var queryparam = 'client_id=' + Constant.OMS_Constant.CLIENT_ID + '&client_secret=' + Constant.OMS_Constant.CLIENT_SECRET + '&grant_type=password' + '&username=' +  Constant.OMS_Constant.USERNAME + '&password=' + Constant.OMS_Constant.PASSWORD;
    return queryparam;
}

var getEligibalePayLoad = function (orderNumber, orderEmail) {
    const APIROOT = '/services/data/v58.0';
    var query = "SELECT Name, Product2Id,ProductCode,Quantity,Status,TotalTaxAmount,StockKeepingUnit,TotalAdjustmentAmount,AdjustedLineAmount,TotalLineAmount,OrderSummary.BillingPhoneNumber, OrderSummary.CreatedDate, OrderSummary.OrderNumber, OrderSummary.TotalAdjDistAmount, OrderSummary.TotalDeliveryAdjDistAmount, OrderSummary.OrderedDate, OrderSummary.GrandTotalAmount, OrderDeliveryGroupSummary.DeliverToName, OrderDeliveryGroupSummary.PhoneNumber, OrderDeliveryGroupSummary.OrderDeliveryMethod.Name,OrderDeliveryGroupSummary.DeliverToAddress,OrderSummary.PoNumber,OrderSummary.Status,OrderSummary.BillingAddress,OrderSummary.TotalAdjustedProductAmount,OrderSummary.TotalAdjustedProductTaxAmount,OrderSummary.TotalAdjDeliveryAmtWithTax,OrderSummary.TotalDeliveryAmount,OrderSummary.TotalTaxAmount FROM OrderItemSummary where OrderSummary.OrderNumber = '"+orderNumber+"' AND type != 'Delivery Charge'";
    query = encodeURIComponent(query);
    var APIQuery = APIROOT + '/query?q='+query;
    return APIQuery;
}


module.exports = {
    getAuthToken: getAuthToken,
    getEligibalePayLoad: getEligibalePayLoad
}