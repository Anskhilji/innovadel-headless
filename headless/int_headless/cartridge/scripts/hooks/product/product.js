'use strict';

var Logger = require('dw/system/Logger');
var Status = require('dw/system/Status');

var productRating = require ("*/cartridge/scripts/helper/productHelper.js");
var ProductFactory = require('*/cartridge/scripts/factories/product');

exports.modifyGETResponse = function (product, res) {

    try {
        var params = {
            pid: product.ID
        };
        var prd = ProductFactory.get(params);
        var sizeChartId = product.primaryCategory && product.primaryCategory.custom.sizeChartID ? product.primaryCategory.custom.sizeChartID : '';
        var productRatings = productRating.getProductRating(product.ID);

        res.c_sizeChartId = sizeChartId;
        res.c_productRatings = productRatings;
        res.c_promotionPrice = prd.price.sales;
        res.c_promotions= prd.promotions;
        
    } catch (ex) {
        Logger.error('(product-modifyGETResponse) -> Error occured while executing Hook and exception is: {0} in {1} : {2}', ex.toString(), ex.fileName, ex.lineNumber);
    }
    
    return new Status(Status.OK);
}